import React from 'react';

const BotAvatar: React.FC = () => {
  // A sleek, futuristic SVG avatar for Alok Bot with a new blue/cyan color scheme.
  const avatarBase64 =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImEiIGN4PSI1MCUiIGN5PSI1MCUiIGZ4PSIwJSIgZnk9IjAlIiByPSI5MCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwMEFGQUEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMDVDOTQiLz48L3JhZGlhbEdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PGNpcmNsZSBjeD0iNTAlIiBjeT0iNTAlIiByPSI0MCUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzZDRkZGRiIgc3Ryb2tlLXdpZHRoPSIyJSIgc3Ryb2tlLW9wYWNpdHk9IjAuOCIvPjxjaXJjbGUgY3g9IjUwJSIgY3k9IjUwJSIgcj0iMzAlIiBmaWxsPSJub25lIiBzdHJva2U9IiM1RkFCRkYiIHN0cm9rZS13aWR0aD0iMS41JSIgc3Ryb2tlLW9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjUwJSIgY3k9IjUwJSIgcj0iMjAlIiBmaWxsPSJub25lIiBzdHJva2U9IiM0Qzg0RkYiIHN0cm9rZS13aWR0aD0iMSUiIHN0cm9rZS1vcGFjaXR5PSIwLjQiLz48bGluZSB4MT0iMTAlIiB5MT0iNTAlIiB4Mj0iOTAlIiB5Mj0iNTAlIiBzdHJva2U9IiM2Q0ZGRkYiIHN0cm9rZS13aWR0aD0iMSUiIHN0cm9rZS1vcGFjaXR5PSIwLjUiLz48bGluZSB4MT0iNTAlIiB5MT0iMTAlIiB4Mj0iNTAlIiB5Mj0iOTAlIiBzdHJva2U9IiM2Q0ZGRkYiIHN0cm9rZS13aWR0aD0iMSUiIHN0cm9rZS1vcGFjaXR5PSIwLjUiLz48L3N2Zz4=';

  return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-800 shadow-lg">
      <img
        src={avatarBase64}
        alt="Alok Bot Avatar"
        className="w-full h-full object-cover rounded-full"
      />
    </div>
  );
};

export default BotAvatar;