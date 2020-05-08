import {combineReducers} from '@reduxjs/toolkit';
// import {reducer as toastrReducer} from 'react-redux-toastr'; // TODO: Add toastr
import answerReducer from '../features/answers/answerSlice';
import consumptionReducer from '../features/consumptions/consumptionSlice';
import foodReducer from '../features/foods/foodSlice';

const rootReducer = combineReducers({
    answerSlice: answerReducer,
    consumptionState: consumptionReducer,
    foodState: foodReducer
});
export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;