
import Layout from '@/components/Layout';

const About = () => {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center space-y-6 px-8">
          <h1 className="text-5xl font-bold text-black mb-8">About CIPHER</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            CIPHER is a modern authentication platform designed with simplicity and security in mind. 
            Our clean, professional interface ensures that your login experience is both beautiful and functional.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Built with the latest web technologies and designed with user experience as our top priority, 
            CIPHER provides a seamless authentication flow that adapts to your needs.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
