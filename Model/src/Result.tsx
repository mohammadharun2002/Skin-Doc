import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Updated interfaces to match the XML structure from the LLM
interface Medication {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  specialInstructions: string;
}

interface PrescriptionData {
  diseaseName: string;
  medications: Medication[];
  advice: string[];
}

export default function Result() {
  const location = useLocation();
  const { prescription } = location.state || { prescription: "No prescription available." };
  const [parsedData, setParsedData] = useState<PrescriptionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const prescriptionRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Function to generate and download PDF
  const handleDownloadPDF = async () => {
    if (!prescriptionRef.current) return;
    
    setIsGeneratingPDF(true);
    
    try {
      const canvas = await html2canvas(prescriptionRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Calculate dimensions to fit in A4
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Prescription_${parsedData?.diseaseName || 'Medical'}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Failed to generate PDF. Please try again.");
    }
    
    setIsGeneratingPDF(false);
  };

  useEffect(() => {
    if (prescription && typeof prescription === 'string') {
      try {
        // Parse the XML string response from the LLM
        const parseXML = (xmlString: string): PrescriptionData => {
          // Extract disease name
          const diseaseNameMatch = xmlString.match(/<diseaseName>(.*?)<\/diseaseName>/s);
          const diseaseName = diseaseNameMatch ? diseaseNameMatch[1].trim() : "Unknown Condition";
          
          // Extract medications
          const medicationsData: Medication[] = [];
          const medicationBlocks = xmlString.match(/<medication>[\s\S]*?<\/medication>/g) || [];
          
          medicationBlocks.forEach(block => {
            const medicineNameMatch = block.match(/<medicineName>(.*?)<\/medicineName>/s);
            const dosageMatch = block.match(/<dosage>(.*?)<\/dosage>/s);
            const frequencyMatch = block.match(/<frequency>(.*?)<\/frequency>/s);
            const durationMatch = block.match(/<duration>(.*?)<\/duration>/s);
            const instructionsMatch = block.match(/<specialInstructions>(.*?)<\/specialInstructions>/s);
            
            medicationsData.push({
              medicineName: medicineNameMatch ? medicineNameMatch[1].trim() : "Not specified",
              dosage: dosageMatch ? dosageMatch[1].trim() : "Not specified",
              frequency: frequencyMatch ? frequencyMatch[1].trim() : "Not specified",
              duration: durationMatch ? durationMatch[1].trim() : "Not specified",
              specialInstructions: instructionsMatch ? instructionsMatch[1].trim() : "None"
            });
          });
          
          // Extract advice points
          const advicePoints: string[] = [];
          const adviceMatches = xmlString.match(/<point>(.*?)<\/point>/gs);
          
          if (adviceMatches) {
            adviceMatches.forEach(match => {
              const point = match.replace(/<point>|<\/point>/g, '').trim();
              if (point) advicePoints.push(point);
            });
          }
          
          return {
            diseaseName,
            medications: medicationsData,
            advice: advicePoints
          };
        };
        
        setParsedData(parseXML(prescription));
      } catch (err) {
        console.error("Error parsing prescription data:", err);
        setError("Could not parse prescription data. Please try again.");
      }
    }
  }, [prescription]);

  return (
    <div style={{ 
      backgroundColor: '#f4f7fa', 
      height: '100vh', 
      width: "100vw",
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '10px'
    }}>
      <motion.div
        style={{
          backgroundColor: 'white',
          color: '#333',
          padding: '20px',
          borderRadius: '16px',
          width: '95%',
          maxWidth: '1000px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          fontFamily: 'Arial, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          height: 'auto',
          maxHeight: '90vh'
        }}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div ref={prescriptionRef} style={{ overflow: 'auto' }}>
          {/* Header with Title and Disease */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '1px solid #e0e0e0',
            paddingBottom: '10px',
            marginBottom: '15px'
          }}>
            <h1 style={{ 
              fontSize: '1.8rem', 
              fontWeight: '700', 
              color: '#0069d9', 
              margin: 0 
            }}>
              Prescription
            </h1>
            
            {parsedData && (
              <div style={{ 
                backgroundColor: '#e9f5ff', 
                padding: '6px 12px', 
                borderRadius: '8px',
              }}>
                <h2 style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: '600', 
                  color: '#0056b3', 
                  margin: 0 
                }}>
                  {parsedData.diseaseName}
                </h2>
              </div>
            )}
          </div>

          {error ? (
            <p style={{ color: '#dc3545', fontSize: '1.1rem' }}>{error}</p>
          ) : !parsedData ? (
            <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>{prescription}</p>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '15px'
            }}>
              {/* Left Column - Medications */}
              <div>
                <h2 style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: '600',
                  margin: '0 0 10px 0',
                  color: '#0069d9',
                  borderBottom: '2px solid #0069d9',
                  paddingBottom: '5px'
                }}>
                  Medication Details
                </h2>
                
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '12px'
                }}>
                  {parsedData.medications.map((med, index) => (
                    <div 
                      key={index} 
                      style={{ 
                        padding: '12px', 
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0',
                        backgroundColor: '#f9f9f9'
                      }}
                    >
                      <h3 style={{ 
                        fontSize: '1.1rem', 
                        fontWeight: '600', 
                        color: '#0069d9', 
                        margin: '0 0 8px 0'
                      }}>
                        {med.medicineName}
                      </h3>
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'auto 1fr',
                        gap: '6px 12px',
                        fontSize: '0.95rem'
                      }}>
                        <span style={{ fontWeight: '600' }}>Dosage:</span>
                        <span>{med.dosage}</span>
                        
                        <span style={{ fontWeight: '600' }}>Frequency:</span>
                        <span>{med.frequency}</span>
                        
                        <span style={{ fontWeight: '600' }}>Duration:</span>
                        <span>{med.duration}</span>
                        
                        {med.specialInstructions !== "None" && (
                          <>
                            <span style={{ fontWeight: '600' }}>Instructions:</span>
                            <span>{med.specialInstructions}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right Column - Medical Advice */}
              <div>
                <h2 style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: '600',
                  margin: '0 0 10px 0',
                  color: '#0069d9',
                  borderBottom: '2px solid #0069d9',
                  paddingBottom: '5px'
                }}>
                  Medical Advice
                </h2>
                
                {parsedData.advice.length > 0 ? (
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '8px'
                  }}>
                    {parsedData.advice.map((point, index) => (
                      <div 
                        key={index} 
                        style={{ 
                          padding: '10px 12px',
                          borderLeft: '3px solid #0069d9',
                          backgroundColor: '#f9f9f9',
                          borderRadius: '0 8px 8px 0',
                          fontSize: '0.95rem'
                        }}
                      >
                        {point}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#6c757d', fontStyle: 'italic' }}>
                    No specific advice provided.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <p style={{ 
            fontSize: '0.85rem', 
            color: '#6c757d', 
            fontStyle: 'italic',
            textAlign: 'center',
            margin: '15px 0 0 0',
            borderTop: '1px solid #e0e0e0',
            paddingTop: '10px'
          }}>
            Please follow the prescription carefully and consult your doctor if symptoms persist.
          </p>
        </div>
        
        {/* Buttons */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          gap: '15px',
          marginTop: '15px'
        }}>
          <motion.button
            style={{
              backgroundColor: '#0069d9',
              color: 'white',
              fontSize: '0.9rem',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0, 105, 217, 0.3)',
              cursor: 'pointer'
            }}
            onClick={() => window.history.back()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go Back
          </motion.button>
          
          <motion.button
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              fontSize: '0.9rem',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(40, 167, 69, 0.3)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onClick={handleDownloadPDF}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? 'Generating...' : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H9v2.5a.5.5 0 0 1-1 0V8.5H5.5a.5.5 0 0 1 0-1H8V5a.5.5 0 0 1 1 0v2.5h2.5z"/>
                </svg>
                Download PDF
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}