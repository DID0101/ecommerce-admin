import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { withSwal } from "react-sweetalert2";

function SettingsPage({ swal }) {
  const [products, setProducts] = useState([]);
  const [featuredProductId, setFeaturedProductId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shippingFee, setShippingFee] = useState('');

  useEffect(() => {
    async function fetchAll() {
      try {
        setIsLoading(true);
        const productsRes = await axios.get('/api/products');
        setProducts(productsRes.data);

        const featuredProductRes = await axios.get('/api/settings?name=featuredProductId');
        setFeaturedProductId(featuredProductRes.data?.value || '');

        const shippingFeeRes = await axios.get('/api/settings?name=shippingFee');
        setShippingFee(shippingFeeRes.data?.value || '');
      } catch (error) {
        console.error('Failed to fetch data', error);
        swal.fire({
          title: 'Error',
          text: 'Failed to fetch settings or products',
          icon: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchAll();
  }, [swal]); // Including swal as a dependency since it's used inside the useEffect

  async function saveSettings() {
    setIsLoading(true);
    try {
      await axios.put('/api/settings', {
        name: 'featuredProductId',
        value: featuredProductId,
      });
      await axios.put('/api/settings', {
        name: 'shippingFee',
        value: shippingFee,
      });
      swal.fire({
        title: 'Settings saved!',
        icon: 'success',
      });
    } catch (error) {
      console.error('Failed to save settings', error);
      swal.fire({
        title: 'Error',
        text: 'Failed to save settings',
        icon: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Layout>
      <h1>Ayarler</h1>
      {isLoading && <Spinner />}
      {!isLoading && (
        <>
          <label>Yeni ürün</label>
          <select value={featuredProductId} onChange={ev => setFeaturedProductId(ev.target.value)}>
            {products.length > 0 && products.map(product => (
              <option key={product._id} value={product._id}>{product.title}</option>
            ))}
          </select>
          <label>Kargo ücreti (TL)</label>
          <input
            type="number"
            value={shippingFee}
            onChange={ev => setShippingFee(ev.target.value)}
          />
          <div>
            <button onClick={saveSettings} className="btn-primary">Ayarlari kaydet</button>
          </div>
        </>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }) => (
  <SettingsPage swal={swal} />
));
