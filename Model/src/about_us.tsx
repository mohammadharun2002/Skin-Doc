import React from 'react';

const AboutUs: React.FC = () => {
  const styles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
      color: '#333',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
    }, 
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      borderBottom: '1px solid #eaeaea',
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#2c88d9',
      textDecoration: 'none',
    },
    nav: {
      display: 'flex',
    },
    navLink: {
      marginLeft: '1.5rem',
      color: '#333',
      textDecoration: 'none',
    },
    activeNavLink: {
      marginLeft: '1.5rem',
      color: '#2c88d9',
      fontWeight: 500,
      textDecoration: 'none',
    },
    contentWrapper: {
      display: 'flex',
      flex: 1,
    },
    leftSection: {
      flexBasis: '30%',
      backgroundColor: 'white',
      padding: '2rem',
      position: 'relative' as const,
      overflow: 'hidden',
    },
    title: {
      fontSize: '2.5rem',
      color: '#2c88d9',
      marginBottom: '0.5rem',
    },
    subtitle: {
      fontSize: '1.2rem',
      color: '#555',
      marginBottom: '2rem',
      fontWeight: 'normal',
    },
    features: {
      marginBottom: '2rem',
    },
    featureItem: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1rem',
    },
    featureIcon: {
      marginRight: '0.75rem',
      fontSize: '1.2rem',
    },
    featureText: {
      fontSize: '1rem',
    },
    doctorIllustration: {
      marginTop: '2rem',
      position: 'relative' as const,
      zIndex: 2,
    },
    waveDecoration: {
      position: 'absolute' as const,
      bottom: 0,
      left: 0,
      right: 0,
      height: '150px',
      backgroundImage: 'linear-gradient(45deg, #2c88d9, #50c8c6, #4ce0b3)',
      borderRadius: '100% 100% 0 0 / 200% 200% 0 0',
      transform: 'scaleX(1.5)',
      zIndex: 1,
    },
    rightSection: {
      flexBasis: '70%',
      backgroundColor: '#f7f7f5',
      padding: '2rem',
      overflowY: 'auto' as const,
    },
    sectionTitle: {
      fontSize: '1.75rem',
      color: '#333',
      marginBottom: '1.5rem',
      paddingBottom: '0.5rem',
      borderBottom: '2px solid #2c88d9',
      display: 'inline-block',
    },
    aboutContent: {
      maxWidth: '800px',
    },
    heading: {
      color: '#2c88d9',
      marginTop: '1.5rem',
      marginBottom: '0.75rem',
    },
    paragraph: {
      lineHeight: 1.6,
      marginBottom: '1rem',
    },
    teamSection: {
      marginTop: '2rem',
    },
    teamGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1.5rem',
      marginTop: '1rem',
    },
    teamMember: {
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      textAlign: 'center' as const,
    },
    memberAvatar: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: '#e0e0e0',
      margin: '0 auto 1rem',
    },
    memberName: {
      fontWeight: 500,
      marginBottom: '0.25rem',
    },
    memberRole: {
      fontSize: '0.9rem',
      color: '#666',
    },
    // Media query styles need to be applied conditionally in the component
  };

  // Function to apply responsive styles
  const getResponsiveStyles = () => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      return {
        contentWrapper: {
          ...styles.contentWrapper,
          flexDirection: 'column' as const,
        },
        leftSection: {
          ...styles.leftSection,
          flexBasis: 'auto',
        },
        rightSection: {
          ...styles.rightSection,
          flexBasis: 'auto',
        },
        teamGrid: {
          ...styles.teamGrid,
          gridTemplateColumns: 'repeat(1, 1fr)',
        },
      };
    }
    return {};
  };

  const [responsiveStyles, setResponsiveStyles] = React.useState({});

  React.useEffect(() => {
    // Set initial responsive styles
    setResponsiveStyles(getResponsiveStyles());

    // Add resize listener
    const handleResize = () => {
      setResponsiveStyles(getResponsiveStyles());
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Merge default styles with responsive styles
  const mergedStyles = {
    ...styles,
    ...responsiveStyles,
  };

  return (
    <div style={mergedStyles.container}>

      <div style={mergedStyles.contentWrapper as any}>
        {/* Left Section */}
        <div style={mergedStyles.leftSection as any}>
          <h1 style={mergedStyles.title}>SkinDoc</h1>
          <h2 style={mergedStyles.subtitle}>Advanced Skin Disease Detection</h2>

          <div style={mergedStyles.features}>
            <div style={mergedStyles.featureItem}>
              <span style={mergedStyles.featureIcon}>✨</span>
              <span style={mergedStyles.featureText}>Instant AI Diagnosis</span>
            </div>
            <div style={mergedStyles.featureItem}>
              <span style={mergedStyles.featureIcon}>🖼</span>
              <span style={mergedStyles.featureText}>Upload Images</span>
            </div>
            <div style={mergedStyles.featureItem}>
              <span style={mergedStyles.featureIcon}>🔍</span>
              <span style={mergedStyles.featureText}>Detailed Analysis</span>
            </div>
          </div>
        </div>

        {/* Right Section - About Us Content */}
        <div style={mergedStyles.rightSection as any}>
          <h2 style={mergedStyles.sectionTitle}>About Us</h2>
          
          <div style={mergedStyles.aboutContent}>
            <h3 style={mergedStyles.heading}>Our Mission</h3>
            <p style={mergedStyles.paragraph}>
              At SkinDoc, we're revolutionizing dermatological care through advanced 
              AI technology. Our mission is to make professional skin disease detection
              accessible to everyone, everywhere.
            </p>
            
            <h3 style={mergedStyles.heading}>Who We Are</h3>
            <p style={mergedStyles.paragraph}>
              Founded by a team of dermatologists and AI specialists, SkinDoc 
              combines medical expertise with cutting-edge artificial intelligence 
              to provide accurate skin condition analysis and recommendations.
            </p>
            
            <h3 style={mergedStyles.heading}>How It Works</h3>
            <p style={mergedStyles.paragraph}>
              Simply upload an image of your skin concern, and our AI algorithm 
              will analyze it instantly, providing a preliminary diagnosis and 
              suggesting next steps. Our technology has been trained on thousands 
              of clinical images to ensure high accuracy.
            </p>
            
            <h3 style={mergedStyles.heading}>Our Technology</h3>
            <p style={mergedStyles.paragraph}>
              Our proprietary AI model can identify over 5 skin conditions with 
              clinical-grade accuracy. The technology continues to learn and improve 
              with each analysis, making it more precise over time.
            </p>
        
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;