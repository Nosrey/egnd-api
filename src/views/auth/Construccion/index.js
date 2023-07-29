import { Button } from 'components/ui'
import React from 'react'

function Construccion() {
  const linkedinURL = 'https://www.linkedin.com/company/egnd/'; // Reemplaza esta URL con la dirección de tu página de LinkedIn

  const handleLinkedInClick = () => {
    window.open(linkedinURL, '_blank');
  };
  return (
    <div>
      <img src='https://i.imgur.com/5I1aNJx.jpg' width={500} alt="description" />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2vh' }} >
        <Button size="xl" variant="solid" onClick={handleLinkedInClick}
          className="ltr:mr-2 rtl:ml-2" >
          Ir a nuestro LinkedIn
        </Button>
      </div>
    </div>
  )
}

export default Construccion