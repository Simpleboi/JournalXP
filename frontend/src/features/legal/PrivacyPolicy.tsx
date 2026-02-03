import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, Shield, Lock, Eye, FileText, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Privacy Policy & Terms
              </h1>
              <p className="text-sm text-gray-600">
                Last updated: 02/01/2026
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Shield className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Your Privacy Matters
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    At JournalXP, we are committed to protecting your privacy and ensuring 
                    the security of your personal information. This Privacy Policy explains 
                    how we collect, use, and safeguard your data in compliance with U.S. 
                    and international privacy laws, including GDPR and CCPA.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Table of Contents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Table of Contents</h3>
              <ul className="space-y-2 text-indigo-600">
                <li><a href="#information-collection" className="hover:underline">1. Information We Collect</a></li>
                <li><a href="#ai-usage" className="hover:underline">2. AI Features & Disclaimer (Sunday AI)</a></li>
                <li><a href="#health-data" className="hover:underline">3. Health & Wellness Data</a></li>
                <li><a href="#data-usage" className="hover:underline">4. How We Use Your Data</a></li>
                <li><a href="#data-sharing" className="hover:underline">5. Data Sharing & Third Parties</a></li>
                <li><a href="#community" className="hover:underline">6. Community & User-Generated Content</a></li>
                <li><a href="#user-rights" className="hover:underline">7. Your Rights (GDPR/CCPA)</a></li>
                <li><a href="#data-security" className="hover:underline">8. Data Security</a></li>
                <li><a href="#data-retention" className="hover:underline">9. Data Retention</a></li>
                <li><a href="#international" className="hover:underline">10. International Data Transfers</a></li>
                <li><a href="#children" className="hover:underline">11. Children's Privacy (COPPA)</a></li>
                <li><a href="#terms" className="hover:underline">12. Terms & Conditions</a></li>
                <li><a href="#arbitration" className="hover:underline">13. Dispute Resolution & Arbitration</a></li>
                <li><a href="#indemnification" className="hover:underline">14. Indemnification</a></li>
                <li><a href="#service-availability" className="hover:underline">15. Service Availability & Changes</a></li>
                <li><a href="#changes" className="hover:underline">16. Policy Changes</a></li>
                <li><a href="#contact" className="hover:underline">17. Contact Us</a></li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Section 1: Information Collection */}
        <motion.section
          id="information-collection"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-5 w-5 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-900">1. Information We Collect</h3>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Personal Information:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Account details (name, email address, username)</li>
                    <li>Profile information (avatar, preferences)</li>
                    <li>Authentication data (encrypted passwords)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Wellness Data:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Journal entries and mood tracking</li>
                    <li>Daily task completion and habit tracking</li>
                    <li>Progress statistics (points, levels, streaks)</li>
                    <li>Meditation and mindfulness activity logs</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Technical Data:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Device information</li>
                    <li>Usage analytics</li>
                    <li>Session Cookies</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Section 2: AI Usage & Disclaimer */}
        <motion.section
          id="ai-usage"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="border-purple-200 bg-purple-50/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="h-5 w-5 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-900">2. AI Features & Disclaimer (Sunday AI)</h3>
              </div>

              <div className="space-y-4 text-gray-700">
                {/* Critical AI Disclaimer */}
                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                  <p className="font-bold text-red-900 mb-2">⚠️ IMPORTANT AI DISCLAIMER:</p>
                  <ul className="list-disc list-inside space-y-2 text-sm text-red-800">
                    <li><strong>Sunday AI is NOT a licensed therapist, counselor, psychologist, psychiatrist, or medical professional.</strong></li>
                    <li>AI responses are for <strong>informational and supportive purposes only</strong> and do not constitute medical advice, diagnosis, or treatment.</li>
                    <li><strong>Do NOT rely on Sunday AI for crisis situations, mental health emergencies, or medical decisions.</strong></li>
                    <li>AI-generated content may be inaccurate, incomplete, or inappropriate for your specific situation.</li>
                    <li>Always consult qualified healthcare professionals for mental health concerns.</li>
                    <li>If you are experiencing thoughts of self-harm or suicide, please contact emergency services (911) or a crisis hotline immediately.</li>
                  </ul>
                </div>

                <p className="font-semibold text-purple-900">
                  Our AI wellness companion, "Sunday," is designed to provide supportive
                  conversations and general wellness guidance. Here's how we handle your AI interactions:
                </p>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What We Collect:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Conversation history with Sunday AI</li>
                    <li>Sentiment analysis and emotional patterns</li>
                    <li>Topics discussed and support requests</li>
                    <li>Feedback on AI responses</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">How AI Data is Used:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Personalization:</strong> To provide contextually relevant support and remember your preferences</li>
                    <li><strong>Improvement:</strong> To enhance AI response quality and accuracy (anonymized data only)</li>
                    <li><strong>Safety:</strong> To detect crisis situations and provide appropriate resources</li>
                    <li><strong>Research:</strong> Aggregated, de-identified data may be used to improve mental health AI systems</li>
                  </ul>
                </div>

                <div className="bg-purple-100 border border-purple-300 rounded-lg p-4">
                  <p className="font-semibold text-purple-900 mb-2">🔒 AI Privacy Protections:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>Conversations are encrypted in transit and at rest</li>
                    <li>AI training uses only anonymized, aggregated data</li>
                    <li>You can delete your conversation history at any time</li>
                    <li>Sunday AI does not share your individual conversations with third parties for marketing</li>
                    <li>Crisis detection is automated and confidential</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Third-Party AI Services:</h4>
                  <p>
                    Sunday AI utilizes third-party AI providers (including OpenAI and/or Anthropic)
                    for natural language processing. These providers:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>Process data under strict data processing agreements</li>
                    <li>May use data for model improvement unless opted out (per their policies)</li>
                    <li>Are GDPR and CCPA compliant</li>
                    <li>Retain conversation data per their retention policies (typically 30 days)</li>
                    <li>Have their own privacy policies which apply to data processed by them</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Limitation of AI Liability:</h4>
                  <p className="text-sm">
                    By using Sunday AI, you acknowledge and agree that JournalXP and its developers
                    shall not be liable for any harm, damages, or adverse outcomes resulting from
                    your reliance on AI-generated responses. You use AI features at your own risk
                    and assume full responsibility for any decisions made based on AI interactions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Section 3: Health & Wellness Data */}
        <motion.section
          id="health-data"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-8"
        >
          <Card className="border-teal-200 bg-teal-50/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-teal-600" />
                <h3 className="text-xl font-bold text-gray-900">3. Health & Wellness Data</h3>
              </div>

              <div className="space-y-4 text-gray-700">
                <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
                  <p className="font-semibold text-amber-900 mb-2">⚕️ HIPAA Notice:</p>
                  <p className="text-sm text-amber-800">
                    JournalXP is <strong>NOT a covered entity under HIPAA</strong> (Health Insurance Portability
                    and Accountability Act). We are not a healthcare provider, health plan, or healthcare
                    clearinghouse. The health and wellness data you provide is not protected health
                    information (PHI) under HIPAA. However, we treat all your data with care and
                    implement strong security measures as described in this policy.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Types of Health & Wellness Data We Collect:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Mood Data:</strong> Mood selections, emotional states, and sentiment from journal entries</li>
                    <li><strong>Fitness Data:</strong> Workout logs, exercise types, sets, reps, weights, and muscle groups</li>
                    <li><strong>Habit Data:</strong> Habit completion, streaks, and behavioral patterns</li>
                    <li><strong>Meditation Data:</strong> Session duration, frequency, and mindfulness activity</li>
                    <li><strong>Sleep & Wellness Notes:</strong> Any self-reported wellness information in journals</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Sensitive Data Classification:</h4>
                  <p>
                    Under GDPR and certain state privacy laws, mood and mental wellness data may be
                    classified as "sensitive personal data" or "special category data." We process
                    this data based on your explicit consent when you create an account and use these features.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Your Control Over Health Data:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>You can delete individual journal entries, habits, or workout logs at any time</li>
                    <li>You can request a full export of your health and wellness data</li>
                    <li>You can request complete deletion of all health-related data</li>
                    <li>We do not share identifiable health data with advertisers or data brokers</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Third-Party Health Integrations:</h4>
                  <p className="text-sm">
                    If we integrate with third-party health platforms (e.g., Apple Health, Google Fit)
                    in the future, such integrations will be optional and require your explicit consent.
                    Data shared with these platforms will be governed by their respective privacy policies.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Section 4: Data Usage */}
        <motion.section
          id="data-usage"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">4. How We Use Your Data</h3>
              
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <p><strong>Service Delivery:</strong> To provide and maintain JournalXP features</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <p><strong>Personalization:</strong> To customize your experience and recommendations</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <p><strong>Communication:</strong> To send important updates, reminders, and support</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <p><strong>Analytics:</strong> To understand usage patterns and improve our services</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <p><strong>Security:</strong> To protect against fraud, abuse, and security threats</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <p><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Section 4: Data Sharing */}
        <motion.section
          id="data-sharing"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">5. Data Sharing & Third Parties</h3>
              
              <div className="space-y-4 text-gray-700">
                <p className="font-semibold text-gray-900">
                  We do NOT sell your personal information. We may share data only in these limited circumstances:
                </p>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Service Providers:</h4>
                  <p className="mb-2">Trusted partners who help us operate JournalXP:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Cloud hosting providers (Google Cloud, Firebase)</li>
                    <li>AI service providers (for Sunday AI functionality)</li>
                    <li>Analytics services (Firebase Analytics, anonymized)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Legal Requirements:</h4>
                  <p>We may disclose information if required by law, court order, or to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>Comply with legal processes</li>
                    <li>Protect user safety or prevent harm</li>
                    <li>Investigate fraud or security issues</li>
                    <li>Enforce our Terms of Service</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Business Transfers:</h4>
                  <p>
                    In the event of a merger, acquisition, or sale of assets, your data may be 
                    transferred. You will be notified of any such change.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Section 6: Community & User-Generated Content */}
        <motion.section
          id="community"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">6. Community & User-Generated Content</h3>

              <div className="space-y-4 text-gray-700">
                <p>
                  JournalXP includes community features where users can share prompts, responses,
                  and interact with others. This section explains how we handle user-generated content.
                </p>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Content You Post:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Community posts are visible to other users (posts are anonymous by default)</li>
                    <li>You retain ownership of content you create</li>
                    <li>By posting, you grant JournalXP a non-exclusive, worldwide, royalty-free license to display, distribute, and promote your content within the service</li>
                    <li>You may delete your community posts at any time</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Content Moderation:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>We use automated and manual moderation to enforce community guidelines</li>
                    <li>Content that violates our guidelines may be removed without notice</li>
                    <li>Repeated violations may result in account suspension or termination</li>
                    <li>We may report illegal content to appropriate authorities</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Prohibited Content:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Harassment, hate speech, or discriminatory content</li>
                    <li>Explicit, violent, or illegal content</li>
                    <li>Spam, self-promotion, or commercial solicitation</li>
                    <li>Content that encourages self-harm or dangerous behavior</li>
                    <li>Personal information about others without consent</li>
                    <li>Impersonation or misleading content</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Your Responsibility:</h4>
                  <p className="text-sm">
                    You are solely responsible for the content you post. JournalXP is not liable
                    for user-generated content and does not endorse opinions expressed by users.
                    If you see content that violates our guidelines, please report it.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Section 7: User Rights */}
        <motion.section
          id="user-rights"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <Card className="border-green-200 bg-green-50/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Scale className="h-5 w-5 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">7. Your Rights (GDPR/CCPA Compliance)</h3>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p className="font-semibold text-green-900">
                  You have the following rights regarding your personal data:
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-2">🔍 Right to Access</h4>
                    <p className="text-sm">Request a copy of all personal data we hold about you</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-2">✏️ Right to Rectification</h4>
                    <p className="text-sm">Correct inaccurate or incomplete information</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-2">🗑️ Right to Erasure</h4>
                    <p className="text-sm">Request deletion of your personal data ("right to be forgotten")</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-2">⏸️ Right to Restrict Processing</h4>
                    <p className="text-sm">Limit how we use your data in certain circumstances</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-2">📦 Right to Data Portability</h4>
                    <p className="text-sm">Receive your data in a machine-readable format</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-2">🚫 Right to Object</h4>
                    <p className="text-sm">Object to processing based on legitimate interests</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-2">🤖 Automated Decision-Making</h4>
                    <p className="text-sm">Opt out of automated decisions that significantly affect you</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-2">💰 Right to Opt-Out of Sale (CCPA)</h4>
                    <p className="text-sm">We don't sell data, but you can opt out of sharing</p>
                  </div>
                </div>

                <div className="bg-green-100 border border-green-300 rounded-lg p-4 mt-4">
                  <p className="font-semibold text-green-900 mb-2">How to Exercise Your Rights:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                    <li>Email us at <a href="mailto:natejsx@gmail.com" className="text-indigo-600 hover:underline">natejsx@gmail.com</a></li>
                    <li>Use the "Data & Privacy" section in Settings</li>
                    <li>We will respond within 30 days (GDPR) or 45 days (CCPA)</li>
                    <li>No fee for requests (unless excessive or repetitive)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Section 6: Data Security */}
        <motion.section
          id="data-security"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-900">8. Data Security</h3>
              </div>
              
              <div className="space-y-3 text-gray-700">
                <p>We implement industry-standard security measures to protect your data:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Encryption:</strong> All data is encrypted in transit (TLS/SSL) and at rest (AES-256)</li>
                  <li><strong>Access Controls:</strong> Strict role-based access with multi-factor authentication</li>
                  <li><strong>Regular Audits:</strong> Security assessments and penetration testing</li>
                  <li><strong>Monitoring:</strong> 24/7 threat detection and incident response</li>
                  <li><strong>Secure Infrastructure:</strong> SOC 2 compliant cloud hosting</li>
                  <li><strong>Data Backups:</strong> Regular encrypted backups with disaster recovery</li>
                </ul>
                <p className="text-sm italic mt-4">
                  While we strive to protect your data, no method of transmission over the internet 
                  is 100% secure. Please use strong passwords and enable two-factor authentication.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Section 7: Data Retention */}
        <motion.section
          id="data-retention"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">9. Data Retention</h3>
              
              <div className="space-y-3 text-gray-700">
                <p>We retain your data only as long as necessary:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Active Accounts:</strong> Data retained while your account is active</li>
                  <li><strong>Inactive Accounts:</strong> Deleted after 2 months of inactivity (with notice)</li>
                  <li><strong>Deleted Accounts:</strong> Most data deleted within 30 days; some retained for legal compliance (up to 2 years)</li>
                  <li><strong>AI Conversations:</strong> Retained for 90 days, then anonymized or deleted</li>
                  <li><strong>Analytics Data:</strong> Aggregated data retained indefinitely (anonymized)</li>
                  <li><strong>Legal Requirements:</strong> Some data retained longer if required by law</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Section 8: International Transfers */}
        <motion.section
          id="international"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">10. International Data Transfers</h3>
              
              <div className="space-y-3 text-gray-700">
                <p>
                  JournalXP operates globally. Your data may be transferred to and processed in 
                  countries other than your own, including the United States.
                </p>
                <p className="font-semibold">For EU/EEA Users:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>We use Standard Contractual Clauses (SCCs) approved by the European Commission</li>
                  <li>Data transfers comply with GDPR Article 46</li>
                  <li>We ensure adequate safeguards for your data protection rights</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Section 11: Children's Privacy (COPPA) */}
        <motion.section
          id="children"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mb-8"
        >
          <Card className="border-orange-200 bg-orange-50/30">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">11. Children's Privacy (COPPA Compliance)</h3>

              <div className="space-y-4 text-gray-700">
                <div className="bg-orange-100 border border-orange-300 rounded-lg p-4">
                  <p className="font-bold text-orange-900 mb-2">Age Requirement:</p>
                  <p className="text-orange-800">
                    <strong>JournalXP is intended for users aged 13 and older.</strong> Users in the
                    European Economic Area (EEA) must be at least 16 years old, or have parental
                    consent where permitted by local law.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">COPPA Compliance:</h4>
                  <p>
                    In compliance with the Children's Online Privacy Protection Act (COPPA), we do
                    not knowingly collect, use, or disclose personal information from children under 13.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">If We Discover Underage Users:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>We will promptly delete their account and all associated data</li>
                    <li>We will not use any collected data for any purpose</li>
                    <li>We may implement additional verification measures if needed</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">For Parents and Guardians:</h4>
                  <p>
                    If you believe your child under 13 has created an account or provided personal
                    information to JournalXP, please contact us immediately at{" "}
                    <a href="mailto:natejsx@gmail.com" className="text-indigo-600 hover:underline">
                      natejsx@gmail.com
                    </a>
                    . We will take steps to delete the information and terminate the account.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">For Users Aged 13-17:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>We encourage parental involvement and supervision</li>
                    <li>Some jurisdictions may require parental consent for certain features</li>
                    <li>Parents may contact us to review, delete, or restrict their teen's data</li>
                    <li>We implement age-appropriate privacy protections</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Mental Health Content Notice for Minors:</h4>
                  <p className="text-sm">
                    Given the mental health nature of JournalXP, we strongly encourage minors to
                    involve a trusted adult (parent, guardian, counselor, or teacher) when using
                    wellness features. Our AI and community features are not substitutes for
                    professional support, especially for young users.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Section 10: Terms & Conditions */}
        <motion.section
          id="terms"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mb-8"
        >
          <Card className="border-indigo-200 bg-indigo-50/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-900">9. Terms & Conditions</h3>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Acceptance of Terms</h4>
                  <p>
                    By using JournalXP, you agree to these Terms and our Privacy Policy. 
                    If you do not agree, please do not use our services.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">User Responsibilities</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Provide accurate and truthful information</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Use the service in compliance with applicable laws</li>
                    <li>Respect other users and community guidelines</li>
                    <li>Do not misuse or attempt to hack our services</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Prohibited Activities</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Posting harmful, abusive, or illegal content</li>
                    <li>Impersonating others or creating fake accounts</li>
                    <li>Spamming or sending unsolicited messages</li>
                    <li>Attempting to access other users' accounts</li>
                    <li>Using automated tools to scrape or collect data</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Intellectual Property</h4>
                  <p>
                    All content, features, and functionality of JournalXP are owned by us and 
                    protected by copyright, trademark, and other intellectual property laws.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Disclaimer of Warranties</h4>
                  <p className="text-sm">
                    JournalXP is provided "as is" without warranties of any kind. We do not 
                    guarantee that the service will be uninterrupted, secure, or error-free. 
                    <strong className="block mt-2">
                      JournalXP is NOT a substitute for professional medical or mental health care. 
                      If you are experiencing a mental health crisis, please contact emergency 
                      services or a mental health professional immediately.
                    </strong>
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Limitation of Liability</h4>
                  <p className="text-sm">
                    To the fullest extent permitted by law, JournalXP shall not be liable for 
                    any indirect, incidental, special, consequential, or punitive damages arising 
                    from your use of the service.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Termination</h4>
                  <p>
                    We reserve the right to suspend or terminate your account if you violate 
                    these Terms. You may also delete your account at any time through Settings.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Governing Law</h4>
                  <p>
                    These Terms are governed by the laws of the United States of America, without regard 
                    to conflict of law principles. Any disputes shall be resolved in the courts 
                    of the USA.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Section 11: Policy Changes */}
        <motion.section
          id="changes"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h3>
              
              <div className="space-y-3 text-gray-700">
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our 
                  practices or legal requirements.
                </p>
                <p className="font-semibold">When we make changes:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>We will update the "Last Updated" date at the top</li>
                  <li>Significant changes will be notified via email or in-app notification</li>
                  <li>Continued use of JournalXP after changes constitutes acceptance</li>
                  <li>You can review previous versions by contacting us</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Section 12: Contact */}
        {/* <motion.section
          id="contact"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="mb-8"
        >
          <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">12. Contact Us</h3>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  If you have questions, concerns, or requests regarding this Privacy Policy 
                  or your personal data, please contact us:
                </p>

                <div className="bg-white rounded-lg p-4 border border-indigo-200">
                  <p className="font-semibold text-gray-900 mb-2">WellPoint Privacy Team</p>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <strong>Email:</strong>{" "}
                      <a href="mailto:privacy@wellpoint.app" className="text-indigo-600 hover:underline">
                        privacy@wellpoint.app
                      </a>
                    </li>
                    <li>
                      <strong>Data Protection Officer:</strong>{" "}
                      <a href="mailto:dpo@wellpoint.app" className="text-indigo-600 hover:underline">
                        dpo@wellpoint.app
                      </a>
                    </li>
                    <li>
                      <strong>Mailing Address:</strong> [Your Company Address]
                    </li>
                    <li>
                      <strong>Response Time:</strong> We aim to respond within 48 hours
                    </li>
                  </ul>
                </div>

                <div className="bg-indigo-100 border border-indigo-300 rounded-lg p-4">
                  <p className="font-semibold text-indigo-900 mb-2">EU/EEA Users:</p>
                  <p className="text-sm">
                    You have the right to lodge a complaint with your local data protection 
                    authority if you believe we have not adequately addressed your concerns.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section> */}

        {/* Crisis Resources */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="mb-8"
        >
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-red-900 mb-4">🆘 Crisis Resources</h3>
              
              <div className="space-y-2 text-gray-700">
                <p className="font-semibold">
                  If you are in crisis or need immediate help:
                </p>
                <ul className="space-y-2 ml-4">
                  <li>
                    <strong>National Suicide Prevention Lifeline (US):</strong>{" "}
                    <a href="tel:988" className="text-indigo-600 hover:underline font-bold">988</a>
                  </li>
                  <li>
                    <strong>Crisis Text Line:</strong> Text "HELLO" to{" "}
                    <a href="sms:741741" className="text-indigo-600 hover:underline font-bold">741741</a>
                  </li>
                  <li>
                    <strong>International Association for Suicide Prevention:</strong>{" "}
                    <a 
                      href="https://www.iasp.info/resources/Crisis_Centres/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      Find help worldwide
                    </a>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Back to Top */}
        <div className="text-center">
          <Button variant="outline" asChild>
            <a href="#" className="inline-flex items-center gap-2">
              Back to Top
            </a>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} JournalXP. All rights reserved.</p>
          <p className="mt-2">
            Your mental health journey, protected by privacy.
          </p>
        </div>
      </footer>
    </div>
  );
}
