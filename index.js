const listProxy = [
    { path: '/vless=101.50.0.114:8443', proxy: '101.50.0.114:8443' },
    { path: '/vless=172.232.252.101:587', proxy: '172.232.252.101:587' },
    { path: '/vless=8.215.23.33:587', proxy: '35.219.50.99:587' },
    { path: '/vless=129.150.50.63:443', proxy: '129.150.50.63:443' },
    { path: '/vless=103.133.223.52:2096', proxy: '103.133.223.52:2096' },
    { path: '/vless=165.154.48.233:587', proxy: '165.154.48.233:587' },
    { path: '/vless=35.219.15.90:443', proxy: '35.219.15.90:443' },
    { path: '/vless=43.218.79.114:2053', proxy: '43.218.79.114:2053' },
    { path: '/vless=203.194.112.119:2053', proxy: '203.194.112.119:2053' },
    { path: '/vless=47.236.7.98:587', proxy: '47.236.7.98:587' },
    { path: '/vless=157.230.33.184:80', proxy: '157.230.33.184:80' },
    // Add more entries as needed
];

let proxyIP;

export default {
    async fetch(request) {
        try {
            const url = new URL(request.url);
            const upgradeHeader = request.headers.get('Upgrade');

            for (const entry of listProxy) {
                if (url.pathname.startsWith(entry.path)) {
                    proxyIP = entry.proxy;
                    break;
                }
            }

            if (upgradeHeader === 'websocket' && proxyIP) {
                return await vlessOverWSHandler(request);
            }

            const allConfig = await getAllConfigVless(request.headers.get('vless.recycle.web.id'));
            return new Response(allConfig, {
                status: 200,
                headers: { "Content-Type": "text/html;charset=utf-8" },
            });
        } catch (err) {
            return new Response(err.toString(), { status: 500 });
        }
    },
};

async function getAllConfigVless(hostName) {
    const configs = await Promise.all(
        listProxy.map(entry => getVLESSConfig(entry.path, hostName, entry.proxy))
    );
    return generateHTML(configs);
}

async function getVLESSConfig(path, hostName, proxyIP) {
    try {
        const response = await fetch(`https://ipwhois.app/json/${proxyIP}`);
        const data = await response.json();
        const isp = data.isp;
        const country = data.country;
        const city = data.city;
        const pathFixed = encodeURIComponent(path);

        const vlessTls = `vless://Palestine@vless.recycle.web.id:443?encryption=none&security=tls&sni=vless.recycle.web.id&fp=randomized&type=ws&host=vless.recycle.web.id&path=${pathFixed}#${isp}`;
        const vlessNtls = `vless://Palestine@vless.recycle.web.id:80?path=${pathFixed}&security=none&encryption=none&host=vless.recycle.web.id&fp=randomized&type=ws&sni=vless.recycle.web.id#${isp}`;
        const vlessTlsFixed = vlessTls.replace(/ /g, '+');
        const vlessNtlsFixed = vlessNtls.replace(/ /g, '+');

        return {
            proxyIP,
            isp,
            country,
            city,
            path,
            vlessTls,
            vlessNtls,
            vlessTlsFixed,
            vlessNtlsFixed
        };
    } catch (error) {
        return { error: "Terjadi kesalahan saat membuat konfigurasi VLESS." };
    }
}function generateHTML(configs) {
    const rows = configs.map(config => `
        <tr>
            <td>${config.proxyIP}</td>
            <td>${config.country}</td>
            <td>${config.isp}</td>
            <td>
                <button class="button2" onclick='copyToClipboard("${config.vlessTlsFixed}")'>Copy TLS</button>
                <button class="button2" onclick='copyToClipboard("${config.vlessNtlsFixed}")'>Copy NTLS</button>
            </td>
        </tr>
    `).join('');

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>VPN Vless | Embeng 🇮🇩🇵🇸</title>
        <link rel="icon" href="https://www.svgrepo.com/download/375724/vpn-alt.svg" type="image/svg+xml">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
        <link rel="stylesheet" href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.min.css">
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
        <style>
            .form-control::placeholder {
                color: #999;
                font-style: italic;
            }
            table.dataTable {
                background-color: #343a40;
                border: 1px solid #6c757d;
                color: white;
                border-collapse: collapse;
            }
            .table-dark tr,
            .table-dark td {
                color: white;
                vertical-align: middle;
            }
            table.dataTable thead {
                background-color: #495057;
                color: white;
            }
            table.dataTable thead th {
                text-align: center;
                border: 1px solid #6c757d;
            }
            table.dataTable tbody td {
                text-align: center;
                border: 1px solid #50575e;
            }
            table.dataTable tbody tr {
                border: 1px solid #50575e;
            }
            table.dataTable tbody tr:hover {
                background-color: #50575e;
            }
            .dataTables_wrapper .dataTables_filter label,
            .dataTables_wrapper .dataTables_length label,
            .dataTables_wrapper .dataTables_info,
            .dataTables_wrapper .dataTables_paginate {
                color: white;
            }
            .dataTables_wrapper .dataTables_filter input,
            .dataTables_wrapper .dataTables_length select {
                color: white;
            }
            .dataTables_wrapper .dataTables_paginate .paginate_button {
                color: white;
            }
            .dataTables_wrapper .dataTables_paginate .paginate_button:hover {
                background-color: #50575e;
                color: white;
            }
            .dataTables_wrapper .dataTables_paginate .paginate_button.current {
                background-color: #50575e;
                color: white;
                border: 1px solid #6c757d;
            }
            .dataTables_wrapper .dataTables_info,
            .dataTables_wrapper .dataTables_paginate {
                color: white;
                text-align: center;
            }
        </style>
    </head>
    <body class="bg-dark text-white">
        <div class="container mt-4">
            <div class="text-center mt-4">
                <h1 class="text-center">Free VPN Vless</h1>
            </div>
            <div class="card bg-secondary text-white">
                <div class="card-body">
                    <h3 class="text-center"><i class="fas fa-network-wired"></i> Add Proxy</h3>
                    <form method="POST" action="#">
                        <div class="mb-3">
                            <label for="proxy" class="form-label"><i class="fas fa-server"></i> Proxy <small class="text-warning" style="font-style: italic;">(Max 10 lines)</small></label>
                            <textarea rows="5" cols="10" class="form-control" id="proxy" name="proxy" placeholder="wildcard : ava.game.naver.com, quiz.vidio.com, graph.instagram.com, investors.spotify.com, io.ruangguru.com, zaintest.vuclip.com, support.zoom.us, cache.netflix.com dll.."></textarea>
                            <div class="alert alert-danger alert-dismissible fade show mt-2" id="lineWarning" style="display: none;">
                                You can only enter a maximum of 10 lines.
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary w-100"><i class="fas fa-save"></i> Submit</button>
                    </form>
                </div>
            </div>
            <div class="card bg-secondary text-white mt-4">
                <div class="card-body">
                    <h3 class="text-center"><i class="fas fa-database"></i> Proxy Database</h3>
                    <div class="table-responsive">
                        <table id="proxyTable" class="table table-bordered table-striped text-white bg-dark table-dark mt-3">
                            <thead>
                                <tr>
                                    <th>Proxy</th>
                                    <th>Country</th>
                                    <th>ISP</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <footer class="bg-dark text-white text-center mt-4">
                <p>&copy; 2024 Free Vless | by~ Embeng.</p>
            </footer>
        </div>
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js"></script>
        <script>
            $(document).ready(function() {
                $('#proxyTable').DataTable();
            });

            function copyToClipboard(text) {
                navigator.clipboard.writeText(text)
                    .then(() => {
                        alert("Copied to clipboard");
                    })
                    .catch((err) => {
                        console.error("Failed to copy to clipboard:", err);
                    });
            }
        </script>
    </body>
    </html>`;
}// Placeholder function for WebSocket handling
async function vlessOverWSHandler(request) {
    return new Response("WebSocket handling not implemented.", { status: 501 });
						 }
