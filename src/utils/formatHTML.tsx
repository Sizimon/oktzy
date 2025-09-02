import { CuratorData } from "@/types/types";
import { formatCurrentTime as timeFormat } from "./formatTime";

const formatContentAsHTML = (data: CuratorData): string => {
    return `
        <video controls style="width: 100%; max-width: 600px;">
            <source src="${data.clipUrl}" type="video/mp4">
            <source src="${data.clipUrl}" type="video/webm">
            <source src="${data.clipUrl}" type="video/ogg">
            Your browser does not support the video tag.
        </video>
        
        <h2>Timestamps</h2>
        <ul>
            ${data.timestamps.map(timestamp => `
                <li style="margin-bottom: 12px;">
                    <strong>${timestamp.title}</strong> - 
                    <span style="color: #666; font-style: italic;">${timeFormat(timestamp.time)}</span>
                    <p style="margin: 4px 0 0 0;">${timestamp.note}</p>
                </li>
            `).join('')}
        </ul>
        
        <hr style="margin: 20px 0;">
        <p style="font-style: italic; color: #888;">Created with Clip Curator</p>
    `;
}

export default formatContentAsHTML;