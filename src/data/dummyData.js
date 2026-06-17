export const generateDummyItems = (count) => {
  const items = [];
  const categories = ['Elektronik', 'Fotografi', 'Berkemah', 'Kendaraan', 'Pakaian'];
  const locations = ['Makassar', 'Jakarta', 'Surabaya', 'Bandung', 'Bali'];
  
  for (let i = 1; i <= count; i++) {
    const category = categories[i % categories.length];
    const location = locations[i % locations.length];
    
    items.push({
      id: `dummy-${i}`,
      nama_barang: `Barang Dummy ${category} ${i}`,
      category: category,
      harga_sewa_per_hari: 10000 + (i % 100) * 1000,
      lokasi: location,
      deskripsi: `Ini adalah deskripsi untuk Barang Dummy ${i}. Barang ini kondisinya masih sangat bagus dan siap disewa kapan saja. Cocok untuk kebutuhan Anda di ${location}.`,
      foto_barang: null,
      createdAt: new Date(Date.now() - (i * 10000000)).toISOString(),
    });
  }
  
  return items;
};

export const dummyItems = generateDummyItems(2000);
