import { Package, Rocket, Users } from "lucide-react";

export default function MarketplacePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-2xl text-center">
        {/* Logo/Icon */}
        <div className="mb-8 flex justify-center">
          <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-6 shadow-xl">
            <Package className="h-16 w-16 text-white" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="mb-4 text-5xl font-bold tracking-tight text-slate-900">
          cot.land
        </h1>
        <p className="mb-8 text-xl text-slate-600">
          The Module Registry for Business Software
        </p>

        {/* Coming Soon Badge */}
        <div className="mb-12 inline-flex items-center gap-2 rounded-full bg-blue-100 px-6 py-3 text-sm font-medium text-blue-700">
          <Rocket className="h-4 w-4" />
          Coming Soon
        </div>

        {/* Description */}
        <div className="mb-12 space-y-4 text-left text-slate-600">
          <p>
            <strong className="text-slate-900">cot.land</strong> will be a registry where
            developers can publish and discover business software modules.
          </p>
          <p>Think npm for entities, workflows, and integrations.</p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 text-left sm:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <Package className="mb-3 h-8 w-8 text-blue-600" />
            <h3 className="mb-2 font-semibold text-slate-900">Browse Modules</h3>
            <p className="text-sm text-slate-600">
              Discover pre-built entities, workflows, and integrations
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <Rocket className="mb-3 h-8 w-8 text-purple-600" />
            <h3 className="mb-2 font-semibold text-slate-900">One-Click Install</h3>
            <p className="text-sm text-slate-600">
              Install modules instantly to your Cot instance
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <Users className="mb-3 h-8 w-8 text-indigo-600" />
            <h3 className="mb-2 font-semibold text-slate-900">Publish & Earn</h3>
            <p className="text-sm text-slate-600">
              Create modules and earn revenue from installs
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 space-y-4">
          <p className="text-sm text-slate-500">
            Marketplace launches Q2 2025
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="https://cot.dev"
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Go to Platform →
            </a>
            <a
              href="https://cot.industries"
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
