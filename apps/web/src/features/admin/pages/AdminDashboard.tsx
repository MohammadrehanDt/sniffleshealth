export default function AdminDashboardPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold text-foreground">
        Admin Dashboard
      </h1>
      <p className="text-sm text-muted-foreground">
        Doctor verification and state license review endpoints are available on
        the API. The admin UI surface still needs the full review tables and
        detail views.
      </p>
    </div>
  );
}
