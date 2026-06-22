"use client";

import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";
import { useEffect, useRef, useState } from "react";

export default function Scanner() {
    const videoRef = useRef<HTMLVideoElement>(null);

    const [barcode, setBarcode] = useState([]);
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (message: string) => {
        setLogs((prev) => [...prev, message]);
    };

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();

        let controls: IScannerControls | undefined;

        const startScanner = async () => {
            try {
                addLog(`Secure Context: ${window.isSecureContext}`);

                const devices =
                    await BrowserMultiFormatReader.listVideoInputDevices();

                addLog(`Cameras Found: ${devices.length}`);

                if (!devices.length) {
                    addLog("No camera found");
                    return;
                }

                devices.forEach((device) => {
                    addLog(device.label || "Unknown Camera");
                });

                const camera =
                    devices.find((d) =>
                        d.label.toLowerCase().includes("back"),
                    ) ||
                    devices.find((d) =>
                        d.label.toLowerCase().includes("rear"),
                    ) ||
                    devices[devices.length - 1];

                addLog(`Using: ${camera.label}`);

                controls = await codeReader.decodeFromVideoDevice(
                    camera.deviceId,
                    videoRef.current!,
                    (result) => {
                        if (result) {
                            const value = result.getText();

                            setBarcode((prev) => [...prev, value]);

                            addLog(`Barcode: ${value}`);
                        }
                    },
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

        startScanner();

        return () => {
            controls?.stop();
        };
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h2>ZXing Scanner Test</h2>

            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                    width: "100%",
                    maxWidth: 500,
                    borderRadius: 12,
                    border: "1px solid #ddd",
                }}
            />

            <div
                style={{
                    marginTop: 20,
                    fontSize: 20,
                    fontWeight: "bold",
                }}
            >
                Barcode: {barcode[barcode.length - 1] || "Waiting..."}
            </div>

            <div
                style={{
                    marginTop: 20,
                    border: "1px solid #ddd",
                    padding: 12,
                    whiteSpace: "pre-wrap",
                    maxHeight: 300,
                    overflowY: "auto",
                }}
            >
                {barcode.map((log, index) => (
                    <div key={index}>{log}</div>
                ))}
            </div>
            <div
                style={{
                    marginTop: 20,
                    border: "1px solid #ddd",
                    padding: 12,
                    whiteSpace: "pre-wrap",
                    maxHeight: 300,
                    overflowY: "auto",
                }}
            >
                {logs.map((log, index) => (
                    <div key={index}>{log}</div>
                ))}
            </div>
        </div>
    );
}
