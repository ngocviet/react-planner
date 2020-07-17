import React from 'react';
import PropTypes from 'prop-types';
import { FaFileExport as IconExport } from 'react-icons/fa';
import ToolbarButton from './toolbar-button';
import { csvDownload } from '../../utils/browser';
import { Project } from '../../class/export';
import { THERMAL_REQUIREMENTS, ACOUSTIC_REQUIREMENTS, FIRE_RESISTANCE_REQUIREMENTS, FUTURE_THERMAL_REGULATION, ISOLATE_BUILDING, HORIZONTAL_PAIRED_BUILDING, COLLECTIVE_BUILDING } from '../../constants';
import { futureThermalRequirements } from './../../data/thermal-regulations/future';
import { currentThermalRequirements, pdaData } from './../../data/thermal-regulations/current';

export default function ToolbarExportFilterButton({ state, type }, { translator }) {

  const title = translator.t(type);

  let saveProjectRequirementsToFile = e => {
    e.preventDefault();
    state = Project.unselectAll(state).updatedState;
    const scene = state.get('scene').toJS();


    const thermalRegulation = scene.thermalRegulation;
    const region = scene.region;
    const commune = scene.commune;
    const thermalZone = scene.thermalZone;
    const typeOfGrouping = scene.typeOfGrouping;

    const csvResult = [];

    let thermalRequirementItem;
    // Check override with pda data
    if (_.find(pdaData, { commune: commune })) {
      thermalRequirementItem = _.find(pdaData, { commune: commune });
    } else {
      thermalRequirementItem = _.find(currentThermalRequirements, { thermalZone: thermalZone });
      if (thermalRegulation === FUTURE_THERMAL_REGULATION) {
        thermalRequirementItem = _.find(futureThermalRequirements, { thermalZone: thermalZone });
      }
    }

    if (type === THERMAL_REQUIREMENTS && !_.isNil(thermalRequirementItem)) {
      const row = {
        'TYPE': translator.t(THERMAL_REQUIREMENTS),
        'TECHUMBRE': thermalRequirementItem.ceiling,
        'MURO PERÍMETRAL': thermalRequirementItem.wall,
        'PISO VENTILADO': thermalRequirementItem.floor
      };
      csvResult.push(row);
    } else if (type === FIRE_RESISTANCE_REQUIREMENTS) {

    } else if (type === ACOUSTIC_REQUIREMENTS) {
      if (typeOfGrouping === HORIZONTAL_PAIRED_BUILDING || typeOfGrouping === COLLECTIVE_BUILDING) {
        csvResult.push({
          'TYPE': 'Requerimiento acústico aéreo',
          'VALUE': 45
        });
        csvResult.push({
          'TYPE': 'Requerimiento acústico de impacto',
          'VALUE': 75
        });
      } else {
        csvResult.push({
          'TYPE': 'Requerimiento acústico aéreo',
          'VALUE': 0
        });
        csvResult.push({
          'TYPE': 'Requerimiento acústico de impacto',
          'VALUE': 0
        });
      }
    }

    let filename = title + '_' + Date.now() + '.csv';

    csvDownload(csvResult, filename);
  };

  return (



    <ToolbarButton active={false} tooltip={title} onClick={saveProjectRequirementsToFile}>
      <IconExport />
    </ToolbarButton>
  );
}

ToolbarExportFilterButton.propTypes = {
  state: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired
};

ToolbarExportFilterButton.contextTypes = {
  translator: PropTypes.object.isRequired,
};
