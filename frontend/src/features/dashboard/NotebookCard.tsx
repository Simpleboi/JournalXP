import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

export const NotebookCard = () => {
    return (<motion.div
        whileHover={{
            y: -5,
            boxShadow:
                "0 10px 25px -5px rgba(100, 116, 139, 0.1), 0 10px 10px -5px rgba(100, 116, 139, 0.04)",
        }}
        transition={{ duration: 0.2 }}
    >
        <Link to="/notebook" className="block h-full">
            <Card className="overflow-hidden h-full bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 border-slate-200 hover:border-slate-400 transition-colors">
                <CardContent className="p-6 flex flex-col items-center text-center h-full">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-slate-100 via-gray-100 to-zinc-100 flex items-center justify-center mb-4">
                        <FileText className="h-8 w-8 text-slate-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Notebook
                    </h3>
                    <p className="text-gray-600 text-sm">
                        Quick thoughts & mental scratchpad
                    </p>
                </CardContent>
            </Card>
        </Link>
    </motion.div>)
}