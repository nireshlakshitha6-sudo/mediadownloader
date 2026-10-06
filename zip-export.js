/**
 * VEROX MEDIA DOWNLOADER - One-Click Project ZIP Generator
 * Generates and downloads the complete project source code as a ZIP archive
 * directly in the browser using JSZip.
 */

async function exportProjectZip() {
  const btn = document.getElementById('btnExportZip') || document.getElementById('btnNavExportZip');
  const originalText = btn ? btn.innerHTML : '';
  
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span><span>Packaging ZIP...</span>`;
  }

  try {
    // 1. Ensure JSZip is loaded
    if (typeof JSZip === 'undefined') {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
    }

    const zip = new JSZip();

    // List of project files to include in the ZIP bundle
    const filesToFetch = [
      'index.html',
      'style.css',
      'app.js',
      'api.js',
      'platforms.js',
      'security.js',
      'zip-export.js',
      'export-zip.html',
      'manifest.json',
      'sw.js',
      'vercel.json',
      'netlify.toml',
      '_headers',
      '_redirects',
      'README.md'
    ];

    // Fetch or package each file
    for (const filename of filesToFetch) {
      try {
        const response = await fetch(`./${filename}`, { cache: 'no-cache' });
        if (response.ok) {
          const content = await response.text();
          zip.file(filename, content);
        } else {
          console.warn(`File ${filename} could not be fetched directly, using placeholder/fallback if available.`);
        }
      } catch (e) {
        console.warn(`Could not read ${filename} via fetch:`, e);
      }
    }

    // Generate ZIP blob
    const content = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 }
    });

    // Trigger browser download
    const blobUrl = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = 'VEROX-MEDIA-DOWNLOADER.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);

    if (window.showToast) {
      window.showToast('VEROX-MEDIA-DOWNLOADER.zip downloaded successfully!', 'success');
    } else {
      alert('Project ZIP downloaded successfully!');
    }
  } catch (err) {
    console.error('ZIP export error:', err);
    if (window.showToast) {
      window.showToast('Failed to generate ZIP. You can also drag-and-drop the project folder directly to Netlify/Vercel.', 'error');
    } else {
      alert('Error generating ZIP: ' + err.message);
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

// Attach export event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const btnNavExport = document.getElementById('btnNavExportZip');
  const btnHeroExport = document.getElementById('btnExportZip');

  if (btnNavExport) btnNavExport.addEventListener('click', exportProjectZip);
  if (btnHeroExport) btnHeroExport.addEventListener('click', exportProjectZip);
});
