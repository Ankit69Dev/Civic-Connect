"use client";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type MapIssue = {
  id: string;
  title: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  priority: string;
  status: string;
};

type IssueMapProps = {
  issues: MapIssue[];
};

const issueIcon = L.divIcon({
  className: "custom-issue-marker",
  html: `
    <div style="
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: #0f172a;
      border: 3px solid white;
      box-shadow: 0 3px 10px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 17px;
    ">
      📍
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -34],
});

export default function IssueMap({
  issues,
}: IssueMapProps) {
  const validIssues = issues.filter(
    (issue) =>
      issue.latitude !== null &&
      issue.longitude !== null &&
      Number.isFinite(issue.latitude) &&
      Number.isFinite(issue.longitude)
  );

  const firstIssue = validIssues[0];

  const center: [number, number] = firstIssue
    ? [firstIssue.latitude!, firstIssue.longitude!]
    : [23.3441, 85.3096];

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={true}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {validIssues.map((issue) => (
        <Marker
          key={issue.id}
          position={[
            issue.latitude!,
            issue.longitude!,
          ]}
          icon={issueIcon}
        >
          <Popup>
            <div className="min-w-[200px]">
              <h3 className="font-semibold text-slate-900">
                {issue.title}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                {issue.location}
              </p>

              <div className="mt-3 flex gap-2 text-xs">
                <span className="rounded-full bg-slate-100 px-2 py-1 font-medium">
                  {issue.priority}
                </span>

                <span className="rounded-full bg-slate-100 px-2 py-1 font-medium">
                  {issue.status.replace("_", " ")}
                </span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}