import React, { useState, useEffect } from 'react'
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false); 
  const [savedQueries, setSavedQueries] = useState([]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const query = searchTerm;

    setSavedQueries((prevQueries) => [...prevQueries, query]);
    localStorage.setItem('savedQueries', JSON.stringify(savedQueries));

    setPhotos([]);
    setPage(1);
    fetchPhotos(query);
  };

  const fetchRandomImages = () => {
    const apiKey = '47faaf86d81bc536bdd4724183fbaff7';
    const apiUrl = `https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=${apiKey}&format=json&nojsoncallback=1&page=${page}&per_page=10`;

    setLoading(true); // Start loading

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const newPhotos = data.photos.photo;
        setPhotos(newPhotos); // Set photos with random images
        setPage(page + 1);
        setLoading(false); // Stop loading
      })
      .catch((error) => {
        console.error(error);
        setLoading(false); // Stop loading in case of an error
      });
  };

  const fetchPhotos = (query) => {
    const apiKey = '47faaf86d81bc536bdd4724183fbaff7';
    const apiUrl = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&text=${query}&format=json&nojsoncallback=1&page=${page}&per_page=25`;
    setLoading(true);

    fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const newPhotos = data.photos.photo;
      setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
      setPage(page + 1);
      setLoading(false);
    })
    .catch((error) => {
      console.error(error);
    setLoading(false);
});
  }



const handleScroll = () => {
  if (
    window.innerHeight + document.documentElement.scrollTop ===
    document.documentElement.offsetHeight
  ) {
    fetchPhotos(searchTerm);
  }
};


useEffect(() => {
  window.addEventListener('scroll', handleScroll);
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, []);


const openPhotoModal = (photo) => {
  setSelectedPhoto(photo);
};

const closePhotoModal = () => {
  setSelectedPhoto(null);
};

const handleSuggestedQueryClick = (query) => {
  setSearchTerm(query);
  fetchPhotos(query);
  setFocused(false);
};

const toggleSuggestions = () => {
  setFocused(!focused);
};

useEffect(() => {
  const savedQueriesFromStorage = JSON.parse(localStorage.getItem('savedQueries')) || [];
  setSavedQueries(savedQueriesFromStorage);
  fetchRandomImages();
}, []);

  return (
  <>
          <Navbar className="bg-body-tertiary justify-content-between">
          <Navbar.Brand className='mx-4' >ORI-PHOTOS</Navbar.Brand>
      <Form  onSubmit={handleSearchSubmit}>
        <Row>
          <Col xs="auto">
            <Form.Control
              type="text"
              placeholder="Search"
              className=" mr-sm-2"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={toggleSuggestions} 
              onBlur={() => setTimeout(() => setFocused(false), 200)} 
            />
          </Col>
          {focused && savedQueries.length > 0 && (
              <Col xs="auto">
                <div className="suggested-queries">
                  {savedQueries.map((query, index) => (
                    <div
                      key={index}
                      className="query-tag"
                      onClick={() => handleSuggestedQueryClick(query)}
                    >
                      {query}
                    </div>
                  ))}
                </div>
              </Col>
            )}
          <Col xs="auto">
            <Button type="submit">Submit</Button>
          </Col>
        </Row>
      </Form>
    </Navbar>

   



    {loading && <div className="loading-indicator">Loading...</div>}

    <div className="photo-grid">
        {photos.map((photo) => (
         
          <div key={photo.id} className="photo-card"   onClick={() => openPhotoModal(photo)} >
            <img
              src={`https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`}
              alt={photo.title}
            />
            
          </div>
        ))}
      </div>

      <Modal show={selectedPhoto !== null} onHide={closePhotoModal}>
<Modal.Header closeButton>
  <Modal.Title>Photo Preview</Modal.Title>
</Modal.Header>
<Modal.Body>
  {selectedPhoto && (
    <img
      src={`https://farm${selectedPhoto.farm}.staticflickr.com/${selectedPhoto.server}/${selectedPhoto.id}_${selectedPhoto.secret}.jpg`}
      alt={selectedPhoto.title}
      className="img-fluid"
    />
  )}
</Modal.Body>
<Modal.Footer>
  <Button variant="secondary" onClick={closePhotoModal}>
    Close
  </Button>
</Modal.Footer>
</Modal>








      
<style type="text/css">
            {`
    .photo-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 10px; /* Adjust the gap size as needed */
    }
    
    .photo-card {
      flex: 1; /* Equal width for each card, adjust as needed */
    }
 

        `}
          </style>

  </>
  );
};

export default Home




