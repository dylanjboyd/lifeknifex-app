import {API_ANSWERS, API_GOALS} from "../Backend";
import axios from "axios";
import {IGoal, IGoalsSlice} from "../reducers/goals";
import {Action, ActionCreator, Dispatch} from "redux";
import {ThunkResult} from "../store/configure-store";
import {IPaginatedResponse} from "../backend-common";
import {ThunkAction} from 'redux-thunk';
import {IAnswer} from "../reducers/answers";


export type IGoalsActions =
    GoalsHasErroredAction
    | GoalsIsLoadingAction
    | GoalsFetchDataSuccessAction
    | GoalUpdateAnswerSuccessAction
    | GoalCreateAnswerSuccessAction
    | GoalCreateSuccessAction
    | GoalUpdateSuccessAction
    | GoalFetchOneSuccessAction;

export enum GoalsActionTypes {
    GOALS_HAS_ERRORED = 'GOALS_HAS_ERRORED',
    GOALS_IS_LOADING = 'GOALS_IS_LOADING',
    GOALS_FETCH_DATA_SUCCESS = 'GOALS_FETCH_DATA_SUCCESS',
    GOAL_UPDATE_ANSWER_SUCCESS = 'GOAL_UPDATE_ANSWER_SUCCESS',
    GOAL_CREATE_ANSWER_SUCCESS = 'GOAL_CREATE_ANSWER_SUCCESS',
    GOAL_CREATE_SUCCESS = 'GOAL_CREATE_SUCCESS',
    GOAL_UPDATE_SUCCESS = 'GOAL_UPDATE_SUCCESS',
    GOAL_FETCH_ONE_SUCCESS = 'GOAL_FETCH_ONE_SUCCESS',
}

export interface GoalsHasErroredAction extends Action<GoalsActionTypes.GOALS_HAS_ERRORED> {
    hasErrored: boolean
}

export const goalsHasErrored: ActionCreator<ThunkAction<void, IGoalsSlice, any, Action>> = (hasErrored: boolean) => (dispatch: Dispatch<GoalsHasErroredAction>) => dispatch({
    type: GoalsActionTypes.GOALS_HAS_ERRORED,
    hasErrored
});

export interface GoalsIsLoadingAction extends Action<GoalsActionTypes.GOALS_IS_LOADING> {
    isLoading: boolean
}

export const goalsIsLoading: ActionCreator<ThunkAction<void, IGoalsSlice, any, GoalsIsLoadingAction>> = (isLoading: boolean) =>
    (dispatch: Dispatch<GoalsIsLoadingAction>) => dispatch({
        type: GoalsActionTypes.GOALS_IS_LOADING,
        isLoading
    });

export interface GoalsFetchDataSuccessAction extends Action<GoalsActionTypes.GOALS_FETCH_DATA_SUCCESS> {
    goals: IPaginatedResponse<IGoal>
}

export const goalsFetchDataSuccess: ActionCreator<ThunkAction<void, IGoalsSlice, any, GoalsFetchDataSuccessAction>> = (goals: IPaginatedResponse<IGoal>) =>
    (dispatch: Dispatch<GoalsFetchDataSuccessAction>) => dispatch({
        type: GoalsActionTypes.GOALS_FETCH_DATA_SUCCESS,
        goals
    });

export interface GoalUpdateAnswerSuccessAction extends Action<GoalsActionTypes.GOAL_UPDATE_ANSWER_SUCCESS> {
    answer: any
}

export const goalUpdateAnswerSuccess: ActionCreator<ThunkAction<void, IGoalsSlice, any, GoalUpdateAnswerSuccessAction>> = (answer: IAnswer) =>
    (dispatch: Dispatch<GoalUpdateAnswerSuccessAction>) => dispatch({
        type: GoalsActionTypes.GOAL_UPDATE_ANSWER_SUCCESS,
        answer
    });

export interface GoalCreateAnswerSuccessAction extends Action<GoalsActionTypes.GOAL_CREATE_ANSWER_SUCCESS> {
    answer: any
}

export const goalCreateAnswerSuccess: ActionCreator<ThunkAction<void, IGoalsSlice, any, GoalCreateAnswerSuccessAction>> = (answer: IAnswer) =>
    (dispatch: Dispatch<GoalCreateAnswerSuccessAction>) => dispatch({
        type: GoalsActionTypes.GOAL_CREATE_ANSWER_SUCCESS,
        answer
    });

export interface GoalCreateSuccessAction extends Action<GoalsActionTypes.GOAL_CREATE_SUCCESS> {
    goal: IGoal
}

export const goalCreateSuccess: ActionCreator<ThunkAction<void, IGoalsSlice, any, GoalCreateSuccessAction>> = (goal: IGoal) =>
    (dispatch: Dispatch<GoalCreateSuccessAction>) => dispatch({
        type: GoalsActionTypes.GOAL_CREATE_SUCCESS,
        goal
    });

export interface GoalUpdateSuccessAction extends Action<GoalsActionTypes.GOAL_UPDATE_SUCCESS> {
    goal: IGoal
}

export const goalUpdateSuccess: ActionCreator<ThunkAction<void, IGoalsSlice, any, GoalUpdateSuccessAction>> = (goal: IGoal) =>
    (dispatch: Dispatch<GoalUpdateSuccessAction>) => dispatch({
        type: GoalsActionTypes.GOAL_UPDATE_SUCCESS,
        goal
    });

export interface GoalFetchOneSuccessAction extends Action<GoalsActionTypes.GOAL_FETCH_ONE_SUCCESS> {
    goal: IGoal
}

export const goalFetchOneSuccess: ActionCreator<ThunkAction<void, IGoalsSlice, any, GoalFetchOneSuccessAction>> = (goal: IGoal) =>
    (dispatch: Dispatch<GoalFetchOneSuccessAction>) => dispatch({
        type: GoalsActionTypes.GOAL_FETCH_ONE_SUCCESS,
        goal
    });

type GoalsFetchAllActions = GoalsIsLoadingAction | GoalsFetchDataSuccessAction | GoalsHasErroredAction;

export function goalsFetchAll(search?: string): ThunkResult<void> {
    const params = {search};
    return (dispatch: Dispatch<any>) => {
        dispatch(goalsIsLoading(true));
        axios.get(API_GOALS, {params: params})
            .then(response => {
                dispatch(goalsIsLoading(false));
                return response;
            })
            .then(response => response.data)
            .then(goals => dispatch(goalsFetchDataSuccess(goals)))
            .catch(() => dispatch(goalsHasErrored((true))));
    };
}

export function goalUpdateAnswer(goal: IGoal, value: number): ThunkResult<void> {
    return (dispatch: Dispatch<any>) => {
        axios.patch(String(goal.todays_answer), {value})
            .then(response => response.data)
            .then(answer => dispatch(goalUpdateAnswerSuccess(answer)));
    };
}

export function goalCreateAnswer(goal: any, value: number): ThunkResult<void> {
    return (dispatch: Dispatch<any>) => {
        axios.post(API_ANSWERS, {
            goal: goal.url,
            value: value
        })
            .then(response => response.data)
            .then(answer => dispatch(goalCreateAnswerSuccess(answer)));
    };
}

export function goalCreate(goal: IGoal): ThunkResult<void> {
    return (dispatch: Dispatch<any>) => {
        axios.post(API_GOALS, goal)
            .then(response => response.data)
            .then(goal => dispatch(goalCreateSuccess(goal)));
    };
}

export function goalUpdate(goal: IGoal): ThunkResult<void> {
    return (dispatch: Dispatch<any>) => {
        axios.patch(`${API_GOALS}${goal.id}/`, goal)
            .then(response => response.data)
            .then(goal => dispatch(goalUpdateSuccess(goal)));
    };
}

export function goalsFetchOne(goalId: number): ThunkResult<void> {
    return (dispatch: Dispatch<any>) => {
        axios.get(`${API_GOALS}${goalId}/`)
            .then(response => response.data)
            .then(goal => dispatch(goalFetchOneSuccess(goal)));
    };
}