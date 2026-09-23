export default async function handler(req, res) {
  const apiKey = 'f287c9ed00464977a308728ab4d884ef';
  const query = encodeURIComponent('"perfume" OR "fragancia" OR "eau de parfum" OR "eau de toilette" OR "nota olfativa" OR "perfumería"');
  const excludeDomains = 'kotaku.com,ign.com,gamespot.com,polygon.com,tmz.com,marca.com,as.com,sport.es,mundodeportivo.com';
  
  const url = `https://newsapi.org/v2/everything?q=${query}&language=es&sortBy=publishedAt&excludeDomains=${excludeDomains}&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // Devolver los datos al frontend
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching news' });
  }
}
