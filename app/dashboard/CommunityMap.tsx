"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import { useEffect } from "react";


// =========================================================
// TYPES
// =========================================================

type MapIssue = {
  id: string;
  title: string;
  description?: string;
  category: string;
  location: string;
  latitude: number;
  longitude: number;
  priority: string;
  status: string;
  createdAt: string;
};

type Props = {
  issues?: MapIssue[];

  userLocation?: {
    latitude: number;
    longitude: number;
  } | null;
};


// =========================================================
// LEAFLET ICON
// =========================================================

const issueIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",

  iconSize: [25, 41],

  iconAnchor: [12, 41],

  popupAnchor: [1, -34],

  shadowSize: [41, 41],
});


// =========================================================
// MAP CENTER CONTROLLER
// =========================================================

function MapCenterController({
  userLocation,
  issues,
}: {
  userLocation: {
    latitude: number;
    longitude: number;
  } | null;

  issues: MapIssue[];
}) {
  const map = useMap();

  useEffect(() => {
    // If user location exists,
    // center the map on the user.
    if (userLocation) {
      map.flyTo(
        [
          userLocation.latitude,
          userLocation.longitude,
        ],
        14,
        {
          duration: 1.2,
        }
      );

      return;
    }

    // If there are issues but no user location,
    // center on the first issue.
    if (issues.length > 0) {
      map.flyTo(
        [
          issues[0].latitude,
          issues[0].longitude,
        ],
        14,
        {
          duration: 1.2,
        }
      );
    }
  }, [
    map,
    userLocation,
    issues,
  ]);

  return null;
}


// =========================================================
// STATUS COLOR
// =========================================================

function getStatusColor(status: string) {
  switch (status?.toLowerCase()) {
    case "resolved":
      return "#22c55e";

    case "in_progress":
      return "#3b82f6";

    case "in_review":
      return "#eab308";

    case "assigned":
      return "#8b5cf6";

    case "rejected":
      return "#64748b";

    case "reported":
    default:
      return "#ef4444";
  }
}


// =========================================================
// PRIORITY COLOR
// =========================================================

function getPriorityColor(priority: string) {
  switch (priority?.toLowerCase()) {
    case "critical":
      return "#dc2626";

    case "high":
      return "#ef4444";

    case "normal":
      return "#eab308";

    case "low":
      return "#22c55e";

    default:
      return "#64748b";
  }
}


// =========================================================
// MAIN MAP
// =========================================================

export default function CommunityMap({
  issues = [],
  userLocation = null,
}: Props) {

  // IMPORTANT:
  // Even if the parent accidentally sends undefined,
  // the map will still receive [] instead of crashing.

  const safeIssues = Array.isArray(issues)
    ? issues
    : [];


  // =======================================================
  // DEFAULT CENTER
  //
  // Ranchi is only a fallback.
  // There is NO hardcoded Patna.
  // =======================================================

  const defaultCenter: [
    number,
    number
  ] = userLocation
    ? [
        userLocation.latitude,
        userLocation.longitude,
      ]
    : safeIssues.length > 0
      ? [
          safeIssues[0].latitude,
          safeIssues[0].longitude,
        ]
      : [
          23.3441,
          85.3096,
        ];


  return (
    <div className="relative h-[360px] w-full">

      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
      >

        {/* =================================================
            OPENSTREETMAP
        ================================================= */}

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


        {/* =================================================
            CENTER MAP
        ================================================= */}

        <MapCenterController
          userLocation={userLocation}
          issues={safeIssues}
        />


        {/* =================================================
            USER LOCATION
        ================================================= */}

        {userLocation && (
          <CircleMarker
            center={[
              userLocation.latitude,
              userLocation.longitude,
            ]}
            radius={9}
            pathOptions={{
              color: "#2563eb",
              fillColor: "#3b82f6",
              fillOpacity: 0.9,
              weight: 3,
            }}
          >
            <Popup>

              <div className="text-center">

                <p className="font-semibold">
                  You are here
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Your current location
                </p>

              </div>

            </Popup>
          </CircleMarker>
        )}


        {/* =================================================
            ISSUE MARKERS
        ================================================= */}

        {safeIssues.map((issue) => (

          <Marker
            key={issue.id}
            position={[
              issue.latitude,
              issue.longitude,
            ]}
            icon={issueIcon}
          >

            <Popup>

              <div className="min-w-[220px]">

                {/* TITLE */}

                <h4 className="text-sm font-bold text-slate-900">
                  {issue.title}
                </h4>


                {/* CATEGORY */}

                <p className="mt-1 text-xs text-slate-500">
                  {issue.category}
                </p>


                {/* LOCATION */}

                <div className="mt-3 flex gap-1.5 text-xs text-slate-600">

                  <span>
                    📍
                  </span>

                  <span>
                    {issue.location}
                  </span>

                </div>


                {/* STATUS + PRIORITY */}

                <div className="mt-3 flex items-center justify-between gap-2">

                  <span
                    className="rounded-full px-2 py-1 text-[10px] font-semibold text-white"
                    style={{
                      backgroundColor:
                        getStatusColor(
                          issue.status
                        ),
                    }}
                  >
                    {formatStatus(
                      issue.status
                    )}
                  </span>


                  <span
                    className="rounded-full px-2 py-1 text-[10px] font-semibold text-white"
                    style={{
                      backgroundColor:
                        getPriorityColor(
                          issue.priority
                        ),
                    }}
                  >
                    {formatStatus(
                      issue.priority
                    )}
                  </span>

                </div>


                {/* DESCRIPTION */}

                {issue.description && (
                  <p className="mt-3 border-t pt-3 text-xs leading-5 text-slate-600">
                    {issue.description}
                  </p>
                )}

              </div>

            </Popup>

          </Marker>

        ))}

      </MapContainer>


      {/* =================================================
          MAP INFO
      ================================================= */}

      <div className="absolute bottom-4 left-4 z-[1000] rounded-xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur">

        <p className="text-xs font-semibold text-slate-800">
          Community Issues
        </p>

        <p className="mt-1 text-[10px] text-slate-500">
          {safeIssues.length} mapped issue
          {safeIssues.length === 1
            ? ""
            : "s"}
        </p>

      </div>


      {/* =================================================
          LEGEND
      ================================================= */}

      <div className="absolute right-4 top-4 z-[1000] rounded-xl bg-white/95 p-3 shadow-lg backdrop-blur">

        <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
          Status
        </p>


        <LegendItem
          color="#ef4444"
          label="Reported"
        />

        <LegendItem
          color="#3b82f6"
          label="In Progress"
        />

        <LegendItem
          color="#22c55e"
          label="Resolved"
        />

      </div>

    </div>
  );
}


// =========================================================
// LEGEND ITEM
// =========================================================

function LegendItem({
  color,
  label,
}: {
  color: string;
  label: string;
}) {

  return (
    <div className="flex items-center gap-2">

      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{
          backgroundColor: color,
        }}
      />

      <span className="text-[10px] text-slate-600">
        {label}
      </span>

    </div>
  );
}


// =========================================================
// FORMAT STATUS
// =========================================================

function formatStatus(value: string) {

  if (!value) {
    return "Unknown";
  }

  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}