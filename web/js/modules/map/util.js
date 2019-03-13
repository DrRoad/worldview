// import { isUndefined as lodashIsUndefined, each as lodashEach } from 'lodash';
import util from '../../util/util';
import { encode } from '../link/util';

export function getMapParameterSetup(
  parameters,
  config,
  models,
  legacyState,
  errors
) {
  const loadedModel = models.map.load(legacyState, errors);
  const leadingExtent = getLeadingExtent();
  return {
    v: {
      stateKey: 'legacy.map.extent',
      initialState: leadingExtent,
      type: 'array',
      options: {
        delimiter: ',',
        parse: () => {
          return loadedModel.extent || leadingExtent;
        },
        serialize: (currentItemState, currentState) => {
          return encode(models.map.extent || leadingExtent);
        }
      }
    },
    r: {
      stateKey: 'legacy.map.rotation',
      initialState: 0,
      options: {
        parse: () => {
          return loadedModel.rotation || 0;
        },
        serialize: (currentItemState, currentState) => {
          return models.map.rotation
            ? (models.map.rotation * (180.0 / Math.PI)).toPrecision(6)
            : undefined;
        }
      }
    }
  };
}

// const LEADING_EXTENT = getLeadingExtent();

// export function serializeExtent(arr) {
//   if (!arr || !arr.length || arr.length !== 4) return LEADING_EXTENT;
//   return encode(arr.join(','));
// }

export function getLeadingExtent() {
  var curHour = util.now().getUTCHours();

  // For earlier hours when data is still being filled in, force a far eastern perspective
  if (curHour < 3) {
    curHour = 23;
  } else if (curHour < 9) {
    curHour = 0;
  }

  // Compute east/west bounds
  var minLon = 20.6015625 + curHour * (-200.53125 / 23.0);
  var maxLon = minLon + 159.328125;

  var minLat = -46.546875;
  var maxLat = 53.015625;

  return [minLon, minLat, maxLon, maxLat];
}

// export function parseMapExtent(str) {
//   const extent = str.split(',').map(parseFloat);
//   var valid = mapIsExtentValid(extent);
//   if (!valid) {
//     util.warn('Invalid extent: ' + extent);
//     return getLeadingExtent();
//   } else {
//     return extent;
//   }
// }
// /**
//  * Determines if an exent object contains valid values.
//  *
//  * @method isExtentValid
//  * @static
//  *
//  * @param extent {OpenLayers.Bound} The extent to check.
//  *
//  * @return {boolean} False if any of the values is NaN, otherwise returns
//  * true.
//  */
// export function mapIsExtentValid(extent) {
//   if (lodashIsUndefined(extent)) {
//     return false;
//   }
//   var valid = true;
//   lodashEach(extent, function(value) {
//     if (isNaN(value)) {
//       valid = false;
//       return false;
//     }
//   });
//   return valid;
// }