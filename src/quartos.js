import Splide from '@splidejs/splide';
import './css/quartos.css';
import '@splidejs/splide/css';
import QuartoCasalImg from './images/quartos/QuartoCasal.png';
import QuartoTriploImg from './images/quartos/QuartoTriplo.png';
import QuartoQuadruploImg from './images/quartos/QuartoQuadruplo.png'

new Splide( '.splide', {
  perPage: 2,
  perMove: 1,
} ).mount();
//  arrowPath: 'M11 20.3152L19.3152 12M11 20.3152H27.6304M11 20.3152L19.3152 27.4425',


document.querySelector('#quarto-casal-aba img').src = QuartoCasalImg;
document.querySelector('#quarto-triplo-aba img').src = QuartoTriploImg;
document.querySelector('#quarto-quadruplo-aba img').src = QuartoQuadruploImg;
//document.querySelector('#QuartoCasal').src = QuartoCasalImg;
