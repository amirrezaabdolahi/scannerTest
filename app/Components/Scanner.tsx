"use client";

import { useRef, useState } from "react";

export default function TestCamera() {
    const [logs, setLogs] = useState<string[]>([]);
    const [counter, setCounter] = useState(0);

    const videoRef = useRef<HTMLVideoElement>(null);

    const addLog = (message: string) => {
        setLogs((prev) => [...prev, message]);
    };

    const openCamera = async () => {
        setCounter((prev) => prev + 1);

        addLog("Button clicked");

        try {
            addLog(`Secure Context: ${window.isSecureContext}`);
            addLog(
                `mediaDevices exists: ${!!navigator.mediaDevices}`
            );

            if (!navigator.mediaDevices) {
                addLog("navigator.mediaDevices is undefined");
                return;
            }

            const stream =
                await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: "environment",
                    },
                });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }

            addLog("Camera permission granted");
            addLog(`Tracks: ${stream.getTracks().length}`);
        } catch (err) {
            console.error(err);

            if (err instanceof Error) {
                addLog(`Error: ${err.name}`);
                addLog(`Message: ${err.message}`);
            } else {
                addLog(`Unknown Error: ${String(err)}`);
            }
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <button
                onClick={openCamera}
                style={{
                    width: 200,
                    height: 60,
                    background: "blue",
                    color: "white",
                    fontSize: 18,
                }}
            >
                Open Camera
            </button>

            <div style={{ marginTop: 20 }}>
                Clicks: {counter}
            </div>

            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                    width: "100%",
                    maxWidth: 500,
                    marginTop: 20,
                    border: "1px solid #ccc",
                    borderRadius: 12,
                }}
            />

            <div
                style={{
                    marginTop: 20,
                    border: "1px solid #ccc",
                    padding: 10,
                    whiteSpace: "pre-wrap",
                }}
            >
                {logs.map((log, index) => (
                    <div key={index}>{log}</div>
                ))}
            </div>
        </div>
    );
}