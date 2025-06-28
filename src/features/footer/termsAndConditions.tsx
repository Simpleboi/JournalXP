import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, ArrowLeft, Book } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ModalWithCard } from "./SecretTrophy";
import { useState } from "react";

const TermsAndConditions = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-md py-6 relative z-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-3">
            <Link to="/" className="h-8 w-8 text-indigo-600">
              <ArrowLeft />
            </Link>
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Book className="h-8 w-8 text-indigo-600" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-indigo-700">
                Terms and Conditions
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="h-fit bg-white py-10 px-4 md:px-8 max-w-6xl mx-auto relative">
        <Helmet>
          <title>Terms and Conditions | JournalXP</title>
        </Helmet>

        <Card className="shadow-md">
          <CardContent className="p-6 space-y-6">
            <h1 className="text-3xl font-bold text-indigo-700">
              Terms and Conditions
            </h1>

            <p className="text-gray-600">
              Welcome to JournalXP. By using this app, you agree to the
              following terms and conditions. Please read them carefully before
              proceeding.
            </p>

            <section>
              <h2 className="text-xl font-semibold text-indigo-600">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700">
                By accessing or using JournalXP, you agree to comply with and be
                bound by these terms. If you do not agree with any part of these
                terms, you may not use our services. We reserve the right to
                modify these terms at any time, and continued use of the app
                signifies your acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-indigo-600">
                2. User Accounts
              </h2>
              <p className="text-gray-700">
                To access certain features of JournalXP, you must create an
                account. You are solely responsible for keeping your login
                credentials confidential and for any activity under your
                account. If you suspect unauthorized access, notify us
                immediately. We reserve the right to suspend or terminate
                accounts found to be in violation of our terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-indigo-600">
                3. Journaling and Personal Content
              </h2>
              <p className="text-gray-700">
                You retain full ownership of the content you write in JournalXP,
                including journal entries, moods, and personal reflections. We
                do not claim rights over your data and will never share, sell,
                or publish your entries without your explicit consent, unless
                required by law. However, we may use anonymized and aggregated
                data to improve app functionality or analytics.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-indigo-600">
                4. Mental Health Disclaimer
              </h2>
              <p className="text-gray-700">
                JournalXP is a self-care and journaling platform intended for
                personal growth and mental wellness support. It is not a
                substitute for professional mental health treatment or
                diagnosis. If you are experiencing a crisis, suicidal thoughts,
                or a mental health emergency, please seek help from a licensed
                mental health provider or call emergency services immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-indigo-600">
                5. Points and Rewards System
              </h2>
              <p className="text-gray-700">
                JournalXP uses a points and gamification system to encourage
                engagement and consistency. Points are earned for completing
                tasks such as journaling, habit tracking, and reflection. These
                points are virtual and do not hold any cash value. They may not
                be exchanged for real-world currency or items outside of the
                app. We reserve the right to modify or reset the rewards system
                at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-indigo-600">
                6. Modifications to the App
              </h2>
              <p className="text-gray-700">
                We are constantly improving JournalXP to provide a better user
                experience. As a result, we may add, remove, or change features
                without prior notice. We are not liable for any consequences
                that arise due to changes, temporary downtime, or
                discontinuation of the app or its services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-indigo-600">
                7. Termination
              </h2>
              <p className="text-gray-700">
                We may suspend or permanently terminate your access to JournalXP
                if you violate these terms, misuse the service, or engage in
                behavior that harms other users or the platform. You may also
                choose to delete your account at any time, after which your data
                will be removed in accordance with our data retention policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-indigo-600">
                8. Governing Law
              </h2>
              <p className="text-gray-700">
                These terms are governed by the laws of the state or country in
                which JournalXP is operated. Any legal disputes arising from
                these terms or the use of JournalXP shall be resolved through
                appropriate legal channels in that jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-indigo-600">
                9. Contact
              </h2>
              <p className="text-gray-700">
                If you have any questions about these Terms and Conditions,
                please contact us at support@journalxp.com.
              </p>
            </section>

            <p className="text-xs text-gray-500 mt-8 italic">
              Last updated: 6/28/2025
            </p>
          </CardContent>
        </Card>
        <Button
          onClick={() => {
            setModalOpen(true);
            console.log("is this being pressed?");
          }}
          variant="default"
          className="text-md mt-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 cursor-pointer hover:text-purple-800"
        >
          Download PDF <ArrowDownToLine className="h-4 w-4 ml-1" />
        </Button>
        <ModalWithCard open={modalOpen} setOpen={setModalOpen} />
      </div>
    </>
  );
};

export default TermsAndConditions;
