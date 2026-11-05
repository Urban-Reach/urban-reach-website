export function ServiceAreaMap() {
  return (
    <div className="mt-10 overflow-hidden rounded-lg border border-rule bg-charcoal p-5 sm:p-7">
      <div className="aspect-[4/3] w-full overflow-hidden rounded-md sm:aspect-[16/10]">
        <iframe
          src="https://www.google.com/maps/d/u/5/embed?mid=1icOAdpZp4cFDA0rGeSqayg36y5meK78&ehbc=2E312F&noprof=1"
          title="Map of the Urban Reach service area across the Austin metro"
          className="h-full w-full"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
}
