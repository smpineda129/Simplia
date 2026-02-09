import { Box } from '@mui/material';
import PublicNavbar from '../../components/public/PublicNavbar';
import HeroSection from '../../components/public/HeroSection';
import SolutionsSection from '../../components/public/SolutionsSection';
import ServicesSection from '../../components/public/ServicesSection';
import ApplicationSection from '../../components/public/ApplicationSection';
import ClientsSection from '../../components/public/ClientsSection';
import ResourcesSection from '../../components/public/ResourcesSection';
import ContactSection from '../../components/public/ContactSection';
import Footer from '../../components/public/Footer';
import WhatsAppButton from '../../components/WhatsAppButton';

const LandingPage = () => {
  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <PublicNavbar />
      <HeroSection />
      <SolutionsSection />
      <ServicesSection />
      <ApplicationSection />
      <ClientsSection />
      <ResourcesSection />
      <ContactSection />
      <Footer />
      <WhatsAppButton />
    </Box>
  );
};

export default LandingPage;
