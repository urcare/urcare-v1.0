import { beforeEach, describe, expect, it, vi } from "vitest";
import { PhonePeService, PhonePeUtils } from "../services/phonepeService";

// Mock Supabase client
const mockSupabase = {
  functions: {
    invoke: vi.fn(),
  },
  rpc: vi.fn(),
  auth: {
    getUser: vi.fn(),
  },
};

// Mock the supabase client
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => mockSupabase,
}));

describe("PhonePe Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initiatePayment", () => {
    it("should initiate payment successfully", async () => {
      const mockResponse = {
        success: true,
        payment_id: "test-payment-id",
        merchant_transaction_id: "TXN_1234567890_abc123",
        phonepe_transaction_id: "phonepe_txn_id",
        redirect_url: "https://mercury.phonepe.com/transact/...",
        payment_url: "https://mercury.phonepe.com/transact/...",
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockResponse,
        error: null,
      });

      const result = await PhonePeService.initiatePayment({
        user_id: "test-user-id",
        plan_id: "test-plan-id",
        billing_cycle: "monthly",
        amount: 99.0,
        payment_method: "card",
      });

      expect(result).toEqual(mockResponse);
      expect(mockSupabase.functions.invoke).toHaveBeenCalledWith(
        "phonepe-payment-initiate",
        {
          body: {
            user_id: "test-user-id",
            plan_id: "test-plan-id",
            billing_cycle: "monthly",
            amount: 99.0,
            payment_method: "card",
          },
        }
      );
    });

    it("should handle payment initiation error", async () => {
      const mockError = new Error("Payment initiation failed");
      mockSupabase.functions.invoke.mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(
        PhonePeService.initiatePayment({
          user_id: "test-user-id",
          plan_id: "test-plan-id",
          billing_cycle: "monthly",
          amount: 99.0,
          payment_method: "card",
        })
      ).rejects.toThrow("Payment initiation failed: Payment initiation failed");
    });
  });

  describe("checkPaymentStatus", () => {
    it("should check payment status successfully", async () => {
      const mockResponse = {
        success: true,
        payment: {
          id: "test-payment-id",
          status: "completed",
          amount: 99.0,
          currency: "INR",
          payment_method: "card",
          billing_cycle: "monthly",
          created_at: "2024-01-01T00:00:00Z",
          processed_at: "2024-01-01T00:05:00Z",
        },
        phonepe_response: {},
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockResponse,
        error: null,
      });

      const result = await PhonePeService.checkPaymentStatus({
        merchant_transaction_id: "TXN_1234567890_abc123",
      });

      expect(result).toEqual(mockResponse);
    });
  });

  describe("validateVPA", () => {
    it("should validate VPA successfully", async () => {
      const mockResponse = {
        success: true,
        valid: true,
        vpa: "user@paytm",
        message: "VPA is valid",
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockResponse,
        error: null,
      });

      const result = await PhonePeService.validateVPA({
        vpa: "user@paytm",
      });

      expect(result).toEqual(mockResponse);
    });
  });

  describe("getPaymentOptions", () => {
    it("should get payment options successfully", async () => {
      const mockResponse = {
        success: true,
        payment_options: {
          upi: { enabled: true, methods: ["UPI_ID", "UPI_QR"] },
          card: { enabled: true, methods: ["DEBIT_CARD", "CREDIT_CARD"] },
          netbanking: { enabled: true, methods: ["NET_BANKING"] },
          wallet: { enabled: true, methods: ["WALLET"] },
        },
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockResponse,
        error: null,
      });

      const result = await PhonePeService.getPaymentOptions();

      expect(result).toEqual(mockResponse);
    });
  });

  describe("processRefund", () => {
    it("should process refund successfully", async () => {
      const mockResponse = {
        success: true,
        refund_id: "REF_1234567890_abc123",
        refund_amount: 99.0,
        payment_id: "test-payment-id",
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockResponse,
        error: null,
      });

      const result = await PhonePeService.processRefund({
        payment_id: "test-payment-id",
        refund_amount: 99.0,
        reason: "Customer requested refund",
      });

      expect(result).toEqual(mockResponse);
    });
  });
});

describe("PhonePe Utils", () => {
  describe("formatAmount", () => {
    it("should format amount correctly for INR", () => {
      expect(PhonePeUtils.formatAmount(99.0, "INR")).toBe("₹99.00");
      expect(PhonePeUtils.formatAmount(1234.56, "INR")).toBe("₹1,234.56");
    });

    it("should use INR as default currency", () => {
      expect(PhonePeUtils.formatAmount(99.0)).toBe("₹99.00");
    });
  });

  describe("isValidVPAFormat", () => {
    it("should validate VPA format correctly", () => {
      expect(PhonePeUtils.isValidVPAFormat("user@paytm")).toBe(true);
      expect(PhonePeUtils.isValidVPAFormat("user@phonepe")).toBe(true);
      expect(PhonePeUtils.isValidVPAFormat("user@googlepay")).toBe(true);
      expect(PhonePeUtils.isValidVPAFormat("user@ybl")).toBe(true);
      expect(PhonePeUtils.isValidVPAFormat("user@upi")).toBe(true);
    });

    it("should reject invalid VPA formats", () => {
      expect(PhonePeUtils.isValidVPAFormat("invalid-vpa")).toBe(false);
      expect(PhonePeUtils.isValidVPAFormat("user@")).toBe(false);
      expect(PhonePeUtils.isValidVPAFormat("@paytm")).toBe(false);
      expect(PhonePeUtils.isValidVPAFormat("")).toBe(false);
    });
  });

  describe("getPaymentMethodDisplayName", () => {
    it("should return correct display names", () => {
      expect(PhonePeUtils.getPaymentMethodDisplayName("card")).toBe(
        "Credit/Debit Card"
      );
      expect(PhonePeUtils.getPaymentMethodDisplayName("upi")).toBe("UPI");
      expect(PhonePeUtils.getPaymentMethodDisplayName("netbanking")).toBe(
        "Net Banking"
      );
      expect(PhonePeUtils.getPaymentMethodDisplayName("wallet")).toBe(
        "Digital Wallet"
      );
      expect(PhonePeUtils.getPaymentMethodDisplayName("unknown")).toBe(
        "unknown"
      );
    });
  });

  describe("getPaymentStatusDisplayName", () => {
    it("should return correct status display names", () => {
      expect(PhonePeUtils.getPaymentStatusDisplayName("pending")).toBe(
        "Pending"
      );
      expect(PhonePeUtils.getPaymentStatusDisplayName("processing")).toBe(
        "Processing"
      );
      expect(PhonePeUtils.getPaymentStatusDisplayName("completed")).toBe(
        "Completed"
      );
      expect(PhonePeUtils.getPaymentStatusDisplayName("failed")).toBe("Failed");
      expect(PhonePeUtils.getPaymentStatusDisplayName("cancelled")).toBe(
        "Cancelled"
      );
      expect(PhonePeUtils.getPaymentStatusDisplayName("refunded")).toBe(
        "Refunded"
      );
      expect(PhonePeUtils.getPaymentStatusDisplayName("unknown")).toBe(
        "unknown"
      );
    });
  });

  describe("generatePaymentUrl", () => {
    it("should generate payment URL with redirect", () => {
      const paymentUrl = "https://mercury.phonepe.com/transact/abc123";
      const redirectUrl = "https://myapp.com/success";

      const result = PhonePeUtils.generatePaymentUrl(redirectUrl, paymentUrl);

      expect(result).toContain(
        "redirect_url=https%3A%2F%2Fmyapp.com%2Fsuccess"
      );
    });
  });
});
