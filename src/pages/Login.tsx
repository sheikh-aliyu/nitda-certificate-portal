import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const Login = () => {
    return (
        <div className="min-h-screen bg-gray-100 relative overflow-hidden flex items-center justify-center">
        {/* Background geometric shapes */}
        <div className="absolute inset-0">
            {/* Large circle top right */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary rounded-full opacity-90"></div>
            {/* Large circle bottom left */}
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary rounded-full opacity-90"></div>
            {/* Small circle left */}
            <div className="absolute top-1/2 left-8 w-4 h-4 bg-primary rounded-full"></div>
            {/* Small circle right */}
            <div className="absolute top-1/3 right-12 w-6 h-6 bg-primary rounded-full"></div>
        </div>

        {/* Login form */}
        <Card className="w-full max-w-md relative z-10 shadow-lg border-0">
            <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-normal text-gray-900 mb-4">
                    Login
                </CardTitle>
                <img 
                    src="/logo.png" 
                    alt="NITDA Logo" 
                    className="mx-auto h-12 object-contain"
                />
            </CardHeader>
            <CardContent className="space-y-6 px-8 pb-8">
            <div className="space-y-4">
                <Input 
                type="email" 
                placeholder="Email"
                className="h-12 border-gray-300 rounded-sm text-base placeholder:text-gray-400"
                />
                <Input 
                type="password" 
                placeholder="Password"
                className="h-12 border-gray-300 rounded-sm text-base placeholder:text-gray-400"
                />
            </div>
            <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-sm">
                Login
            </Button>
            </CardContent>
        </Card>
        </div>
    );
};

export default Login;