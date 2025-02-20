export default function ReportLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
            <head>
                <title>Reporte de Usuario</title>
                <style>
                    {`
                    body {
                        font-family: Arial, sans-serif;
                        background: white;
                        color: black;
                        margin: 0;
                        padding: 20px;
                    }
                    .report-container {
                        width: 100%;
                        max-width: 800px;
                        margin: auto;
                    }
                    @media print {
                        body {
                            zoom: 90%;
                        }
                    }
                    .bg-green-500 {
                        --tw-bg-opacity: 1;
                        background-color: rgb(34 197 94 / var(--tw-bg-opacity, 1));
                    }

                    .bg-red-500 {
                        --tw-bg-opacity: 1;
                        background-color: rgb(239 68 68 / var(--tw-bg-opacity, 1));
                    }
                    `}
                </style>
            </head>
            <body>
                <div className="report-container">{children}</div>
            </body>
        </html>
    );
}
