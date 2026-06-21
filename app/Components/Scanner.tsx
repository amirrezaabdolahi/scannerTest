"use client";

import { BrowserMultiFormatReader } from "@zxing/browser";
import { useEffect, useRef, useState } from "react";

export default function TestScanner() {
    const videoRef = useRef<HTMLVideoElement>(null);

    const [barcode, setBarcode] = useState("");
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (message: string) => {
        setLogs((prev) => [...prev, message]);
    };

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();

        const start = async () => {
            try {
                addLog(`Secure Context: ${window.isSecureContext}`);

                const devices =
                    await BrowserMultiFormatReader.listVideoInputDevices();

                addLog(`Cameras Found: ${devices.length}`);

                devices.forEach((d) => {
                    addLog(`Camera: ${d.label}`);
                });

                if (!devices.length) {
                    addLog("No camera found");
                    return;
                }

                const camera =
                    devices.find((d) =>
                        d.label.toLowerCase().includes("back")
                    ) ||
                    devices.find((d) =>
                        d.label.toLowerCase().includes("rear")
                    ) ||
                    devices[devices.length - 1];

                addLog(`Using: ${camera.label}`);

                await codeReader.decodeFromVideoDevice(
                    camera.deviceId,
                    videoRef.current!,
                    (result) => {
                        if (result) {
                            const value = result.getText();

                            setBarcode(value);

                            addLog(`Barcode: ${value}`);
                        }
                    }
                );
            } catch (error) {
                console.error(error);

                if (error instanceof Error) {
                    addLog(`${error.name}: ${error.message}`);
                } else {
                    addLog(String(error));
                }
            }
        };

        start();

        return () => {
            codeReader.reset();
        };
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h2>Scanner Test</h2>

            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                    width: "100%",
                    maxWidth: 500,
                    borderRadius: 12,
                }}
            />

            <div
                style={{
                    marginTop: 20,
                    fontSize: 20,
                    fontWeight: "bold",
                }}
            >
                Barcode:
                {" "}
                {barcode || "Waiting..."}
            </div>

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