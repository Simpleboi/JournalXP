import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, ArrowLeft, Coffee, Gift, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DonatePage = () => {
  const [donationAmount, setDonationAmount] = useState<string>("10");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [donorName, setDonorName] = useState<string>("");
  const [donorEmail, setDonorEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [donationComplete, setDonationComplete] = useState<boolean>(false);

  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would connect to a payment processor
    console.log("Processing donation:", {
      amount: donationAmount === "custom" ? customAmount : donationAmount,
      name: donorName,
      email: donorEmail,
      message,
    });
    setDonationComplete(true);
  };

  const donationTiers = [
    {
      value: "5",
      label: "$5",
      description: "Supporter",
      icon: <Coffee className="h-4 w-4 text-amber-500" />,
    },
    {
      value: "10",
      label: "$10",
      description: "Friend",
      icon: <Heart className="h-4 w-4 text-pink-500" />,
    },
    {
      value: "25",
      label: "$25",
      description: "Patron",
      icon: <Gift className="h-4 w-4 text-purple-500" />,
    },
    {
      value: "50",
      label: "$50",
      description: "Champion",
      icon: <Star className="h-4 w-4 text-yellow-500" />,
    },
    {
      value: "custom",
      label: "Custom",
      description: "Your choice",
      icon: <Heart className="h-4 w-4 text-indigo-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-indigo-50"
              >
                <ArrowLeft className="h-5 w-5 text-indigo-600" />
              </Button>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Back to JournalXP
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <Heart className="h-10 w-10 text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Support JournalXP
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              JournalXP is committed to providing mental health tools without
              subscriptions or pay-to-win features. Your donation helps us keep
              the platform accessible to everyone.
            </p>
          </div>

          {donationComplete ? (
            <Card className="bg-white shadow-xl border-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 z-0"></div>
              <CardContent className="relative z-10 p-8 text-center">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Heart className="h-8 w-8 text-green-600" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Thank You for Your Support!
                </h2>
                <p className="text-gray-600 mb-6">
                  Your contribution helps us continue providing mental health
                  tools to everyone without barriers.
                </p>
                <p className="text-gray-600 mb-6">
                  We've sent a confirmation to your email address.
                </p>
                <Button
                  asChild
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  <Link to="/">Return to Dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white shadow-xl border-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 z-0"></div>
              <CardContent className="relative z-10 p-8">
                <Tabs defaultValue="one-time" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="one-time">
                      One-time Donation
                    </TabsTrigger>
                    <TabsTrigger value="monthly">Monthly Support</TabsTrigger>
                  </TabsList>

                  <TabsContent value="one-time" className="space-y-6">
                    <form onSubmit={handleDonationSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">
                          Choose an amount
                        </h3>
                        <RadioGroup
                          value={donationAmount}
                          onValueChange={setDonationAmount}
                          className="grid grid-cols-2 gap-4 sm:grid-cols-5"
                        >
                          {donationTiers.map((tier) => (
                            <div key={tier.value}>
                              <RadioGroupItem
                                value={tier.value}
                                id={`amount-${tier.value}`}
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor={`amount-${tier.value}`}
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-indigo-200 peer-data-[state=checked]:border-indigo-500 [&:has([data-state=checked])]:border-indigo-500 cursor-pointer"
                              >
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                                  {tier.icon}
                                </div>
                                <div className="mt-3 font-semibold">
                                  {tier.label}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {tier.description}
                                </div>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>

                        {donationAmount === "custom" && (
                          <div className="mt-4">
                            <Label htmlFor="custom-amount">
                              Enter amount ($)
                            </Label>
                            <Input
                              id="custom-amount"
                              type="number"
                              min="1"
                              step="1"
                              value={customAmount}
                              onChange={(e) => setCustomAmount(e.target.value)}
                              placeholder="Enter amount"
                              className="mt-1"
                              required={donationAmount === "custom"}
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">
                          Your Information
                        </h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              value={donorName}
                              onChange={(e) => setDonorName(e.target.value)}
                              placeholder="Your name"
                              className="mt-1"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={donorEmail}
                              onChange={(e) => setDonorEmail(e.target.value)}
                              placeholder="Your email"
                              className="mt-1"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="message">Message (Optional)</Label>
                          <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Share why you're supporting JournalXP..."
                            className="w-full min-h-[100px] p-3 mt-1 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      >
                        Complete Donation
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="monthly" className="space-y-6">
                    <form onSubmit={handleDonationSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">
                          Choose a monthly amount
                        </h3>
                        <RadioGroup
                          value={donationAmount}
                          onValueChange={setDonationAmount}
                          className="grid grid-cols-2 gap-4 sm:grid-cols-5"
                        >
                          {donationTiers.map((tier) => (
                            <div key={tier.value}>
                              <RadioGroupItem
                                value={tier.value}
                                id={`monthly-${tier.value}`}
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor={`monthly-${tier.value}`}
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-indigo-200 peer-data-[state=checked]:border-indigo-500 [&:has([data-state=checked])]:border-indigo-500 cursor-pointer"
                              >
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                                  {tier.icon}
                                </div>
                                <div className="mt-3 font-semibold">
                                  {tier.label}/mo
                                </div>
                                <div className="text-xs text-gray-500">
                                  {tier.description}
                                </div>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>

                        {donationAmount === "custom" && (
                          <div className="mt-4">
                            <Label htmlFor="custom-monthly-amount">
                              Enter monthly amount ($)
                            </Label>
                            <Input
                              id="custom-monthly-amount"
                              type="number"
                              min="1"
                              step="1"
                              value={customAmount}
                              onChange={(e) => setCustomAmount(e.target.value)}
                              placeholder="Enter amount"
                              className="mt-1"
                              required={donationAmount === "custom"}
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">
                          Your Information
                        </h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <Label htmlFor="monthly-name">Name</Label>
                            <Input
                              id="monthly-name"
                              value={donorName}
                              onChange={(e) => setDonorName(e.target.value)}
                              placeholder="Your name"
                              className="mt-1"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="monthly-email">Email</Label>
                            <Input
                              id="monthly-email"
                              type="email"
                              value={donorEmail}
                              onChange={(e) => setDonorEmail(e.target.value)}
                              placeholder="Your email"
                              className="mt-1"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="monthly-message">
                            Message (Optional)
                          </Label>
                          <textarea
                            id="monthly-message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Share why you're supporting WellPoint..."
                            className="w-full min-h-[100px] p-3 mt-1 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      >
                        Start Monthly Support
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="bg-gray-50 px-8 py-4 border-t">
                <div className="w-full text-center text-sm text-gray-500">
                  <p>
                    Your donation helps us maintain and improve JournalXP
                    without requiring subscriptions.
                  </p>
                  <p className="mt-1">
                    All donations are securely processed. You'll receive a
                    receipt via email.
                  </p>
                </div>
              </CardFooter>
            </Card>
          )}

          <div className="mt-12 bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Why We Need Your Support
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800 mb-2">Server Costs</h3>
                <p className="text-sm text-gray-600">
                  Keeping our platform online and responsive requires reliable
                  servers and infrastructure.
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800 mb-2">New Features</h3>
                <p className="text-sm text-gray-600">
                  Your support helps us develop new tools and features to better
                  support mental health journeys.
                </p>
              </div>
              <div className="bg-pink-50 p-4 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-pink-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800 mb-2">
                  Accessibility
                </h3>
                <p className="text-sm text-gray-600">
                  We're committed to keeping JournalXP accessible to everyone,
                  regardless of financial situation.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>JournalXP - Your Mental Health Companion</p>
          <p className="mt-2">
            Thank you for considering supporting our mission.
          </p>
          <p className="mt-2 text-xs">
            © {new Date().getFullYear()} JournalXP. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DonatePage;
