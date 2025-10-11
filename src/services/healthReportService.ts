import { supabase } from '@/integrations/supabase/client';

export interface HealthReport {
  id: string;
  user_id: string;
  report_name: string;
  file_path: string | null;
  file_size: number | null;
  mime_type: string | null;
  upload_date: string | null;
  created_at: string | null;
}

export interface UploadResult {
  success: boolean;
  file_path?: string;
  error?: string;
  report_id?: string;
}

export class HealthReportService {
  /**
   * Upload a health report file to Supabase storage
   */
  static async uploadHealthReport(
    file: File,
    reportName: string,
    userId: string
  ): Promise<UploadResult> {
    try {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!allowedTypes.includes(file.type)) {
        return {
          success: false,
          error: 'Invalid file type. Please upload PDF, JPG, PNG, or DOC files only.'
        };
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return {
          success: false,
          error: 'File size too large. Please upload files smaller than 10MB.'
        };
      }

      // Create unique file path: user_id/filename
      const fileExtension = file.name.split('.').pop();
      const timestamp = Date.now();
      const fileName = `${reportName.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.${fileExtension}`;
      const filePath = `${userId}/${fileName}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('health-reports')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        return {
          success: false,
          error: `Upload failed: ${uploadError.message}`
        };
      }

      // Save record to database
      const { data: reportData, error: dbError } = await supabase
        .from('user_health_reports')
        .insert({
          user_id: userId,
          report_name: reportName,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          upload_date: new Date().toISOString()
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database insert error:', dbError);
        // Try to clean up the uploaded file
        await supabase.storage.from('health-reports').remove([filePath]);
        return {
          success: false,
          error: `Database error: ${dbError.message}`
        };
      }

      return {
        success: true,
        file_path: filePath,
        report_id: reportData.id
      };

    } catch (error: any) {
      console.error('Health report upload error:', error);
      return {
        success: false,
        error: `Upload failed: ${error.message}`
      };
    }
  }

  /**
   * Get all health reports for a user
   */
  static async getUserHealthReports(userId: string): Promise<HealthReport[]> {
    try {
      const { data, error } = await supabase
        .from('user_health_reports')
        .select('*')
        .eq('user_id', userId)
        .order('upload_date', { ascending: false });

      if (error) {
        console.error('Error fetching health reports:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching health reports:', error);
      return [];
    }
  }

  /**
   * Get download URL for a health report
   */
  static async getDownloadUrl(filePath: string): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from('health-reports')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      if (error) {
        console.error('Error creating download URL:', error);
        return null;
      }

      return data.signedUrl;
    } catch (error) {
      console.error('Error creating download URL:', error);
      return null;
    }
  }

  /**
   * Delete a health report
   */
  static async deleteHealthReport(reportId: string, userId: string): Promise<boolean> {
    try {
      // Get the file path first
      const { data: report, error: fetchError } = await supabase
        .from('user_health_reports')
        .select('file_path')
        .eq('id', reportId)
        .eq('user_id', userId)
        .single();

      if (fetchError || !report) {
        console.error('Error fetching report for deletion:', fetchError);
        return false;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('user_health_reports')
        .delete()
        .eq('id', reportId)
        .eq('user_id', userId);

      if (dbError) {
        console.error('Database deletion error:', dbError);
        return false;
      }

      // Delete from storage
      if (report.file_path) {
        const { error: storageError } = await supabase.storage
          .from('health-reports')
          .remove([report.file_path]);

        if (storageError) {
          console.error('Storage deletion error:', storageError);
          // Don't return false here as the database record is already deleted
        }
      }

      return true;
    } catch (error) {
      console.error('Error deleting health report:', error);
      return false;
    }
  }
}
