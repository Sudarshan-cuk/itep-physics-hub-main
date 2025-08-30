import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { BookOpen, Eye, EyeOff, Phone } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc'; // Importing Google icon from react-icons
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    batchYear: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const { toast } = useToast();

  const { user, signIn, signUp, signInWithGoogle, signInWithOtp, isApproved } = useAuth();

  if (user && isApproved) {
    return <Navigate to="/" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
      } else {
        const batchYear = formData.batchYear && !isNaN(parseInt(formData.batchYear)) ? parseInt(formData.batchYear) : undefined;
        await signUp(formData.email, formData.password, formData.fullName, batchYear);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: '', password: '', fullName: '', batchYear: '', phone: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="ml-2 text-2xl font-bold">ITEP HUB</span>
          </div>
          <CardTitle className="text-2xl text-center">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin ? 'Sign in to access your ITEP resources' : 'Join the ITEP community'}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="batchYear">Batch Year (Optional)</Label>
                <Input
                  id="batchYear"
                  name="batchYear"
                  type="number"
                  placeholder="e.g., 2023"
                  value={formData.batchYear}
                  onChange={handleInputChange}
                />
              </div>
            )}

            {user && !isApproved && (
              <div className="p-4 bg-accent rounded-lg">
                <p className="text-sm text-accent-foreground">
                  Your account is pending approval. Please wait for an admin to activate your account.
                </p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (isLogin ? 'Signing In...' : 'Creating Account...') : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>

            {isLogin && (
              <>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" onClick={() => signInWithGoogle()}>
                    <FcGoogle className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                  <Button variant="outline" onClick={() => setOtpSent(true)}>
                    <Phone className="mr-2 h-4 w-4" />
                    Phone
                  </Button>
                </div>
                {otpSent && (
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                    <Button onClick={() => signInWithOtp(formData.phone)} disabled={loading}>
                      Send OTP
                    </Button>
                    <Label htmlFor="otp">OTP</Label>
                    <Input
                      id="otp"
                      name="otp"
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                    <Button onClick={async () => {
                      setLoading(true);
                      const { error } = await supabase.auth.verifyOtp({
                        phone: formData.phone,
                        token: otp,
                        type: 'sms',
                      });
                      if (error) {
                        toast({
                          title: 'Error',
                          description: error.message,
                          variant: 'destructive',
                        });
                      } else {
                        toast({
                          title: 'Success',
                          description: 'OTP verified successfully!',
                        });
                      }
                      setLoading(false);
                    }} disabled={loading}>
                      Verify OTP
                    </Button>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-between items-center w-full">
              <Button type="button" variant="link" onClick={toggleMode} className="text-sm p-0 h-auto">
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </Button>
              {isLogin && (
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              )}
            </div>

            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
              ← Back to Home
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Auth;
