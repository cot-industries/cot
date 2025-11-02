import { Button } from "@cot/ui";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DemoPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-8">
        <div className="flex justify-center">
          <Sparkles className="h-16 w-16 text-primary" />
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight">
          Cot Demo Application
        </h1>
        
        <p className="text-xl text-muted-foreground">
          This is a live demonstration of an ERP built with Cot. 
          See how developers can create powerful, custom business applications 
          in minutes instead of months.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/customers">
              View Customers <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="https://cot.dev" target="_blank">
              Visit Dashboard
            </Link>
          </Button>
        </div>
        
        <div className="pt-8 space-y-4 text-left rounded-lg border p-6">
          <h2 className="font-semibold text-lg">How This Works</h2>
          <ol className="text-muted-foreground text-sm space-y-2 list-decimal ml-4">
            <li>
              <strong>Define Entity:</strong> Created "customers" entity in Cot dashboard using AI
            </li>
            <li>
              <strong>Auto-Generate:</strong> Cot auto-created Postgres table, REST API, and Admin UI
            </li>
            <li>
              <strong>Consume API:</strong> This demo app fetches data via REST API with API key
            </li>
            <li>
              <strong>Custom UI:</strong> Built custom UI using @cot/ui components
            </li>
          </ol>
        </div>

        <div className="pt-4 text-sm text-muted-foreground">
          <p>cot.ac - Demo Instance</p>
          <p className="mt-2">
            Built with <span className="font-semibold">Cot</span> • 
            Styled with <span className="font-semibold">@cot/ui</span>
          </p>
        </div>
      </div>
    </div>
  );
}
