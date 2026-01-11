// Configuration
const API_BASE = "https://api.emporiaenergy.com";

function createButton() {
    const btn = document.createElement("button");
    btn.innerText = "📥 Export All CSVs";
    btn.style.position = "fixed";
    btn.style.bottom = "20px";
    btn.style.right = "20px";
    btn.style.zIndex = "9999";
    btn.style.padding = "15px 20px";
    btn.style.background = "#4CAF50";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.borderRadius = "5px";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
    
    btn.onclick = startExport;
    document.body.appendChild(btn);
}

async function startExport() {
    // 1. Get Token
    const data = await chrome.storage.local.get("emporia_token");
    const token = data.emporia_token;
    
    if (!token) {
        alert("Token not found! Please refresh the page to capture the auth token, then try again.");
        return;
    }

    const headers = { "authtoken": token };
    
    // 2. Fetch Device List
    try {
        console.log("Fetching devices...");
        const devicesResp = await fetch(`${API_BASE}/customers/devices`, { headers });
        const devicesData = await devicesResp.json();
        
        // Flatten structure: Main devices + nested devices (circuits)
        let allDevices = [];
        devicesData.devices.forEach(d => {
            allDevices.push(d);
            if (d.devices) allDevices.push(...d.devices); // Add nested devices
        });

        // 3. Iterate and Download
        // Default range: Last 30 days. Modify 'start'/'end' as needed.
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 1);

        const formatDate = (date) => date.toISOString().slice(0, 10);

        for (const device of allDevices) {
            const params = new URLSearchParams({
                deviceGid: device.deviceGid,
                startDate: formatDate(start),
                endDate: formatDate(end)
            });
            
            const url = `${API_BASE}/devices/usage/export?${params.toString()}`;
            
            console.log(`Fetching data for ${device.deviceName || device.deviceGid}...`);
            const usageResp = await fetch(url, { headers });

            if (!usageResp.ok) {
                console.error(`Failed to export data for ${device.deviceName || device.deviceGid}. Status: ${usageResp.status}`);
                continue; // Move to the next device
            }

            const csvData = await usageResp.text();
            const deviceName = String(device.deviceName || device.deviceGid).replace(/\s/g, "_");
            const fileName = `emporia_${deviceName}_${formatDate(new Date())}.csv`;
            
            // Do not download the CSV, as the fetch call already triggered the email.
            // downloadDataAsCSV(csvData, fileName);
            
            // Respect rate limits
            await new Promise(r => setTimeout(r, 500));
        }
        alert("Export Complete!");
        
    } catch (e) {
        console.error(e);
        alert("Error exporting data. Check console.");
    }
}

function downloadDataAsCSV(csvData, fileName) {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Inject on load
createButton();

