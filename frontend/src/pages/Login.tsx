import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/authcontext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await login(email, password);
            
            // Navigate based on user role
            if (response.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center">
            {/* Background circles */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-green-800 rounded-full opacity-50"></div>
            <div className="absolute -bottom-52 -right-20 w-96 h-96 bg-green-800 rounded-full opacity-50"></div>

            {/* Login form */}
            <div className="w-full max-w-sm p-8 space-y-8 bg-white rounded-lg shadow-xl z-10">
                <div className="text-center">
                    <img 
                        src="/logo.png" 
                        alt="NITDA Logo" 
                        className="mx-auto h-16 object-contain mb-4"
                    />
                    <h1 className="text-2xl font-bold text-gray-900">Login</h1>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                            id="email"
                            type="email" 
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-12"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                            id="password"
                            type="password" 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-12"
                            required
                            disabled={loading}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 bg-green-800 hover:bg-green-900 text-white font-bold"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Login;