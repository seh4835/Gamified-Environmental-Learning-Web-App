import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/ui/Loader";

export default function Login() {
    const {login} = useAuth();
    const navigate = useNavigate();

    const[formData, setFormData] = useState({
        email: "" ,
        password: "" ,
    });

    const [error, setError] = useState(null);
    const[loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try{
            const res = await login(formData);
            if (res.success) {
                navigate("/dashboard");
            } else {
                setError(res.message);
            }
        }
        catch (err) {
            setError(
                err?.response?.data?.error ||
                "Invalid credentials. Please try again."
            );
        }
        finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader fullScreen text="Signing you in..." />;
    }

    return (
        <div className= "min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white px-6">
            <div className = "w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-100">

                {/* Heading */}
                <h2 className= "text-2xl font-bold text-gray-900 text-center">
                    Welcome Back
                </h2>
                <p className= "mt-2 text-sm text-gray-600 text-center">
                    Sign in to continue your sustainability journey.
                </p>

                {/* Error Message */}
                {error && (
                    <div className= "mt-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-md px-4 py-2">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className= "mt-6 space-y-5">
                    {/*Email*/}
                    <div>
                        <label className= "block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                        type= "email" 
                        name= "email" 
                        required
                        value= {formData.email}
                        onChange={handleChange}
                        className= "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder= "you@example.com"
                        />
                    </div>

                    {/*Password*/}
                    <div>
                        <label className= "block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className= "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder = "Enter your password"
                        />
                    </div>

                    {/*Submit Button*/}
                    <button
                    type= "submit"
                    className= "w-full py-3 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition"
                    >
                        Sign In
                    </button>
                </form>

                {/*Footer Link*/}
                <p className= "mt-6 text-sm text-center text-gray-600">
                    Don't have? {" "}
                    <Link
                    to="/register"
                    className= "text-green-600 hover:text-green-700 font-medium"
                    >
                        Register Here
                    </Link>
                </p>
            </div>
        </div>
    );
}