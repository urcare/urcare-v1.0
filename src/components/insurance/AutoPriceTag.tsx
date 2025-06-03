
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  Users, 
  Building2, 
  MapPin,
  Calendar,
  Percent,
  TrendingDown,
  Settings
} from 'lucide-react';

interface PricingMatrix {
  role: string;
  basePrice: number;
  discount: number;
  ageMultiplier: number;
  packageTier: string;
}

interface PackageDetails {
  name: string;
  tier: string;
  basePrice: number;
  features: string[];
  discount: number;
}

export const AutoPriceTag = () => {
  const [selectedRole, setSelectedRole] = useState('employee');
  const [selectedPackage, setSelectedPackage] = useState('premium');
  const [age, setAge] = useState(35);
  const [location, setLocation] = useState('metro');
  const [familySize, setFamilySize] = useState(4);

  const pricingMatrix: PricingMatrix[] = [
    { role: 'employee', basePrice: 15000, discount: 0, ageMultiplier: 1.0, packageTier: 'standard' },
    { role: 'dependent', basePrice: 12000, discount: 15, ageMultiplier: 0.8, packageTier: 'standard' },
    { role: 'senior_citizen', basePrice: 25000, discount: 5, ageMultiplier: 1.8, packageTier: 'senior' },
    { role: 'student', basePrice: 8000, discount: 25, ageMultiplier: 0.6, packageTier: 'basic' }
  ];

  const packageDetails: PackageDetails[] = [
    {
      name: 'Basic Health',
      tier: 'basic',
      basePrice: 8000,
      features: ['OPD Coverage: ₹25,000', 'IPD Coverage: ₹2,00,000', 'Emergency: ₹50,000'],
      discount: 0
    },
    {
      name: 'Premium Care',
      tier: 'premium',
      basePrice: 15000,
      features: ['OPD Coverage: ₹50,000', 'IPD Coverage: ₹5,00,000', 'Emergency: ₹1,00,000', 'Maternity: ₹75,000'],
      discount: 10
    },
    {
      name: 'Corporate Plus',
      tier: 'corporate',
      basePrice: 20000,
      features: ['OPD Coverage: ₹75,000', 'IPD Coverage: ₹10,00,000', 'Emergency: ₹2,00,000', 'Maternity: ₹1,50,000', 'Dental: ₹25,000'],
      discount: 15
    },
    {
      name: 'Family Shield',
      tier: 'family',
      basePrice: 35000,
      features: ['Family Floater: ₹15,00,000', 'All Benefits Included', 'Health Checkups', 'Wellness Programs'],
      discount: 20
    }
  ];

  const locationMultipliers = {
    metro: 1.2,
    tier1: 1.0,
    tier2: 0.85,
    tier3: 0.7
  };

  const ageAdjustments = [
    { range: '18-25', multiplier: 0.8 },
    { range: '26-35', multiplier: 1.0 },
    { range: '36-45', multiplier: 1.2 },
    { range: '46-55', multiplier: 1.5 },
    { range: '56-65', multiplier: 1.8 },
    { range: '65+', multiplier: 2.2 }
  ];

  const calculatePrice = () => {
    const roleData = pricingMatrix.find(p => p.role === selectedRole);
    const packageData = packageDetails.find(p => p.tier === selectedPackage);
    
    if (!roleData || !packageData) return 0;

    let price = packageData.basePrice;
    
    // Apply role-based adjustments
    price *= roleData.ageMultiplier;
    
    // Apply age-based multiplier
    let ageMultiplier = 1.0;
    if (age <= 25) ageMultiplier = 0.8;
    else if (age <= 35) ageMultiplier = 1.0;
    else if (age <= 45) ageMultiplier = 1.2;
    else if (age <= 55) ageMultiplier = 1.5;
    else if (age <= 65) ageMultiplier = 1.8;
    else ageMultiplier = 2.2;
    
    price *= ageMultiplier;
    
    // Apply location multiplier
    price *= locationMultipliers[location as keyof typeof locationMultipliers];
    
    // Apply family size discount
    if (familySize >= 4) price *= 0.85;
    else if (familySize >= 3) price *= 0.90;
    
    // Apply role discount
    price *= (1 - roleData.discount / 100);
    
    // Apply package discount
    price *= (1 - packageData.discount / 100);
    
    return Math.round(price);
  };

  const finalPrice = calculatePrice();
  const basePrice = packageDetails.find(p => p.tier === selectedPackage)?.basePrice || 0;
  const totalDiscount = basePrice - finalPrice;
  const discountPercentage = ((totalDiscount / basePrice) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dynamic Pricing Calculator</h2>
          <p className="text-gray-600">Role-based pricing with automatic adjustments</p>
        </div>
        
        <Button variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Configure Pricing
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Pricing Inputs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="role">Member Role</Label>
              <select 
                id="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="employee">Employee</option>
                <option value="dependent">Dependent</option>
                <option value="senior_citizen">Senior Citizen</option>
                <option value="student">Student</option>
              </select>
            </div>

            <div>
              <Label htmlFor="package">Package Tier</Label>
              <select 
                id="package"
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="basic">Basic Health</option>
                <option value="premium">Premium Care</option>
                <option value="corporate">Corporate Plus</option>
                <option value="family">Family Shield</option>
              </select>
            </div>

            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <select 
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="metro">Metro City</option>
                <option value="tier1">Tier 1 City</option>
                <option value="tier2">Tier 2 City</option>
                <option value="tier3">Tier 3 City</option>
              </select>
            </div>

            <div>
              <Label htmlFor="family">Family Size</Label>
              <Input
                id="family"
                type="number"
                value={familySize}
                onChange={(e) => setFamilySize(parseInt(e.target.value) || 1)}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Price Display */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Calculated Premium</CardTitle>
            <CardDescription>Based on selected parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-green-600">₹{finalPrice.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Annual Premium</div>
              
              {totalDiscount > 0 && (
                <div className="flex items-center justify-center gap-2">
                  <span className="line-through text-gray-500">₹{basePrice.toLocaleString()}</span>
                  <Badge className="bg-green-100 text-green-800">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    {discountPercentage.toFixed(1)}% OFF
                  </Badge>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-semibold">₹{Math.round(finalPrice / 12).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Monthly EMI</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-semibold">₹{totalDiscount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Savings</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Package Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Package Comparison
          </CardTitle>
          <CardDescription>Compare features across different tiers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {packageDetails.map((pkg) => (
              <div 
                key={pkg.tier}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedPackage === pkg.tier ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
                }`}
                onClick={() => setSelectedPackage(pkg.tier)}
              >
                <div className="text-center mb-3">
                  <h3 className="font-semibold">{pkg.name}</h3>
                  <div className="text-2xl font-bold text-blue-600">₹{pkg.basePrice.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Base Price</div>
                </div>
                
                <div className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="text-xs text-gray-600 flex items-center gap-1">
                      <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                </div>
                
                {pkg.discount > 0 && (
                  <Badge className="mt-2 bg-green-100 text-green-800 w-full justify-center">
                    {pkg.discount}% Discount
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Age-based Pricing Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Age-based Pricing Structure
          </CardTitle>
          <CardDescription>Premium adjustments by age group</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ageAdjustments.map((adjustment, index) => (
              <div key={index} className="text-center p-3 border rounded-lg">
                <div className="font-semibold">{adjustment.range}</div>
                <div className="text-lg text-blue-600">{(adjustment.multiplier * 100).toFixed(0)}%</div>
                <div className="text-xs text-gray-600">of base rate</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Location-based Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Geographic Pricing Variations
          </CardTitle>
          <CardDescription>Location-based premium adjustments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(locationMultipliers).map(([loc, multiplier]) => (
              <div 
                key={loc}
                className={`p-3 border rounded-lg text-center cursor-pointer transition-all ${
                  location === loc ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
                }`}
                onClick={() => setLocation(loc)}
              >
                <div className="font-semibold capitalize">{loc.replace('tier', 'Tier ')}</div>
                <div className="text-lg text-blue-600">{(multiplier * 100).toFixed(0)}%</div>
                <div className="text-xs text-gray-600">of base rate</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
