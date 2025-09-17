<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  exclude-result-prefixes="s">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html>
      <head>
        <title>ITEP Physics Hub — Sitemap</title>
        <meta charset="utf-8"/>
        <style>
          body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; margin: 2rem; color: #0f172a; }
          h1 { font-size: 1.5rem; margin: 0 0 1rem; }
          p { color: #475569; }
          table { border-collapse: collapse; width: 100%; margin-top: 1rem; }
          th, td { border-bottom: 1px solid #e2e8f0; text-align: left; padding: 0.5rem 0.75rem; }
          th { color: #334155; font-weight: 600; font-size: 0.875rem; }
          td { font-size: 0.925rem; }
          a { color: #2563eb; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .muted { color: #64748b; }
        </style>
      </head>
      <body>
        <h1>ITEP Physics Hub — Sitemap</h1>
        <p class="muted">This is a human-friendly view. Search engines read the raw XML.</p>
        <table>
          <thead>
            <tr>
              <th>URL</th>
              <th>Last Modified</th>
              <th>Change Freq</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="//s:url">
              <tr>
                <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
                <td><xsl:value-of select="s:lastmod"/></td>
                <td><xsl:value-of select="s:changefreq"/></td>
                <td><xsl:value-of select="s:priority"/></td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
  
</xsl:stylesheet>


