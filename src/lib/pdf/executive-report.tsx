import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { DistrictSummaryDTO } from "../queries";

const styles = StyleSheet.create({
  page: { padding: 36, fontFamily: "Helvetica", fontSize: 10, color: "#1e293b", backgroundColor: "#ffffff" },
  header: { borderBottomWidth: 2, borderBottomColor: "#0f172a", paddingBottom: 12, marginBottom: 18 },
  title: { fontSize: 20, fontWeight: "bold", color: "#0f172a" },
  subtitle: { fontSize: 10, color: "#64748b", marginTop: 4 },
  table: { display: "flex", width: "auto", marginTop: 12, borderStyle: "solid", borderWidth: 1, borderColor: "#cbd5e1" },
  tableRow: { flexDirection: "row", borderBottomColor: "#e2e8f0", borderBottomWidth: 1, minHeight: 24, alignItems: "center" },
  tableHeader: { backgroundColor: "#f8fafc", fontWeight: "bold", color: "#334155" },
  colName: { width: "25%", paddingLeft: 6 },
  colScore: { width: "15%", textAlign: "center" },
  colFactor: { width: "30%", paddingLeft: 6 },
  colAction: { width: "30%", paddingLeft: 6 },
  badgeHigh: { color: "#dc2626", fontWeight: "bold" },
  footer: { position: "absolute", bottom: 24, left: 36, right: 36, textAlign: "center", fontSize: 8, color: "#94a3b8" },
});

export const ExecutiveReportDocument: React.FC<{
  districts: DistrictSummaryDTO[];
  generatedAt: string;
}> = ({ districts, generatedAt }) => (
  <Document title="Sentry - Executive Briefing Kota Semarang">
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>SENTRY: EXECUTIVE POLICY BRIEF</Text>
        <Text style={styles.subtitle}>
          Analisis Epidemiologi Prediktif Kerentanan Iklim & Beban Penyakit Kota Semarang | Tanggal: {generatedAt}
        </Text>
      </View>

      <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 6 }}>
        Ringkasan Kerentanan 16 Kecamatan (Prioritas Intervensi)
      </Text>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.colName}>Kecamatan</Text>
          <Text style={styles.colScore}>Skor Bahaya</Text>
          <Text style={styles.colFactor}>Pemicu Utama</Text>
          <Text style={styles.colAction}>Rekomendasi Intervensi</Text>
        </View>

        {districts.map((d) => (
          <View style={styles.tableRow} key={d.id}>
            <Text style={styles.colName}>{d.name}</Text>
            <Text style={[styles.colScore, d.compositeScore >= 70 ? styles.badgeHigh : {}]}>
              {d.compositeScore} / 100
            </Text>
            <Text style={styles.colFactor}>{d.primaryFactor}</Text>
            <Text style={styles.colAction}>{d.recommendation}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.footer}>
        Dihasilkan secara otomatis oleh Engine Analitik Sentry (DSDC 2026) - Dinas Kesehatan Kota Semarang
      </Text>
    </Page>
  </Document>
);
