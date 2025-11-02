import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loader from "@/context/Loader";
import { UserContext } from "@/context/UserContext";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const { setUser, loading, setLoading } = useContext(UserContext);
  const [registerData, setRegisterData] = useState({
    email: "",
    name: "",
    password: "",
  });
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!registerData.email || !registerData.name || !registerData.password) {
      toast.error("Please fill all the fields");
      setLoading(false);
      return;
    }

    if (!emailRegex.test(registerData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      await createUserWithEmailAndPassword(
        auth,
        registerData.email,
        registerData.password
      )
        .then((userCreds) => {
          const user = userCreds.user;
          db.collection("users").doc(user.uid).set({
            name: registerData.name,
            email: registerData.email,
            password: registerData.password,
            uid: user.uid,
            createdAt: new Date(),
          });
          toast.success("Account created successfully , now Login!");
          setRegisterData({
            email: "",
            name: "",
            password: "",
          });
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          const err = error.message;
          console.log(err);
          return toast.error("Something went wrong");
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const [loginData, setLoginData] = useState({
    email: "",
    password: "", // Fix typo
  });
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!loginData.email || !loginData.password) {
        toast.error("Please fill all the fields");
        return;
      }

      if (!emailRegex.test(loginData.email)) {
        toast.error("Please enter a valid email address");
        return;
      }

      await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      )
        .then((userCreds) => {
          const user = userCreds.user;
          db.collection("users")
            .doc(user.uid)
            .get()
            .then((doc) => {
              setUser({
                email: doc.data().email,
                name: doc.data().name,
                id: doc.data().uid,
                createdAt: doc.data().createdAt,
                password: doc.data().password,
              });
            })
            .catch((err) => {
              console.log(err);
              toast.error("Something went wrong");
            });
          localStorage.setItem("user", JSON.stringify(user));
          toast.success("Logged in successfully");
          setLoading(false);
          navigate("/overview");
        })
        .catch((error) => {
          const errCode = error.code;
          const errMsg = error.message;
          console.log(errCode, errMsg);
          if (errCode == "auth/invalid-email") {
            toast.error("Invalid email");
            setLoading(false);
            return;
          } else if (errCode == "auth/invalid-credential") {
            toast.error("Invalid credentials");
            setLoading(false);
            return;
          }
          setLoading(false);
          setLoginData({
            email: "",
            password: "",
          });
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    setLoading(true);
    try {
      const userCreds = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = userCreds.user;
      if (!user) {
        setLoading(false);
        setUser(null);
        toast.error("Failed to log in with Google");
        return;
      }
      await db.collection("users").doc(user.uid).set({
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        id: user.uid,
        createdAt: new Date(),
      });

      setUser({
        email: user.email,
        name: user.displayName,
        id: user.uid,
        createdAt: new Date(),
      });

      localStorage.setItem(
        "user",
        JSON.stringify({
          email: user.email,
          name: user.displayName,
          id: user.uid,
          photoURL: user.photoURL,
          createdAt: new Date(),
        })
      );

      toast.success("Logged in successfully with Google");
      navigate("/");
    } catch (error) {
      console.error("Error logging in with Google:", error);
      toast.error("Failed to log in with Google");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Styling */}
      <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Auth Content */}
      <div className="relative bg-slate-900 flex items-center justify-center p-8 z-10 rounded-lg shadow-lg">
        {loading ? (
          <Loader />
        ) : (
          <div className="w-[400px] space-y-4">
            {/* Page Title */}
            <h1 className="text-4xl font-bold text-white text-center">
              CashTrack
            </h1>

            {/* Tabs for Login and Register */}
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                      Welcome Back! Please enter your login details.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        onChange={(e) =>
                          setLoginData({ ...loginData, email: e.target.value })
                        }
                        value={loginData.email}
                        id="email"
                        type="email"
                        placeholder="JpjZ4@example.com"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        onChange={(e) =>
                          setLoginData({
                            ...loginData,
                            password: e.target.value,
                          })
                        }
                        value={loginData.password}
                        id="password"
                        placeholder="Password"
                        type="password"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-1">
                    <Button
                      disabled={loading}
                      className="w-full"
                      onClick={handleLogin}
                    >
                      {loading ? "Loading..." : "Login"}
                    </Button>
                    <div className="relative my-2">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or continue with
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={googleLogin}
                      variant="outline"
                      className="w-full"
                      type="button"
                    >
                      Continue with Google
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>
                      Welcome to CashTrack! Please enter your details.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            name: e.target.value,
                          })
                        }
                        value={registerData.name}
                        id="name"
                        type="text"
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            email: e.target.value,
                          })
                        }
                        value={registerData.email}
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            password: e.target.value,
                          })
                        }
                        value={registerData.password}
                        id="password"
                        type="password"
                        placeholder="Your password"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-1">
                    <Button
                      disabled={loading}
                      onClick={handleRegister}
                      className="w-full"
                    >
                      {loading ? "Loading..." : "Register"}
                    </Button>
                    <div className="relative my-2">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or continue with
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" type="button">
                      Register with Google
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
