import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Header } from 'semantic-ui-react';
import moment from 'moment';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import BreadcrumbSet from '../common-components/BreadcrumbSet';
import HeaderBar from '../common-components/HeaderBar';
import PlaceholderSet from '../common-components/PlaceholderSet';
import { BACKEND_DATE_FORMAT } from '../../constants';
import AnswerEmpty from './AnswerEmpty';
import AnswerPre from './AnswerPre';
import AnswerPost from './AnswerPost';
import { extractError, firstCase } from '../../Utils';
import IGoal from '../../models/IGoal';
import { createAnswer, fetchAllGoals, updateAnswer } from '../../features/goals/goalSlice';
import {
  selectAllGoals,
  selectGoalsLoaded,
  selectGoalsLoading,
} from '../../features/goals/goalSelectors';

const sections = [
  { name: 'Goals', href: '/goals' },
  { name: 'Answer' },
];

const Answer: React.FC = () => {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const { goalId } = useParams();
  const history = useHistory();
  const goals = useSelector(selectAllGoals);
  const isLoading = useSelector(selectGoalsLoading);
  const isLoaded = useSelector(selectGoalsLoaded);
  const [goalIndex, setGoalIndex] = useState(-1);
  const [done, setDone] = useState(false);
  const isPostMode = new URLSearchParams(search).get('mode') === 'post';
  const [filteredGoals, setFilteredGoals] = useState<IGoal[] | null>(null);
  const currentGoal = filteredGoals?.[goalIndex];
  const [candidateValue, setCandidateValue] = useState(currentGoal?.todays_answer_value ?? 0);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // TODO: Remove this code smell - use props for re-render instead of manually setting state
    if (currentGoal) setCandidateValue(currentGoal.todays_answer_value ?? 0);
  }, [currentGoal]);

  useEffect(() => {
    if (!isLoaded) dispatch(fetchAllGoals());
  }, [dispatch, isLoaded]);

  const filterGoals = useCallback(() => {
    if (!filteredGoals) {
      setFilteredGoals(goals.filter((goal) => {
        const filterPre = !goalId
          && goal.last_answered !== moment().format(BACKEND_DATE_FORMAT);
        const filterPost = isPostMode || (goalId && goal.id === Number(goalId));
        return filterPost || filterPre;
      }));
    }
  }, [filteredGoals, goalId, goals, isPostMode]);

  useEffect(() => {
    if (isLoaded && !filteredGoals) filterGoals();
  }, [goals, isLoaded, filteredGoals, filterGoals]);

  const goToGoal = useCallback((increment: number = 1) => {
    if (!goals.length || !filteredGoals) {
      setDone(true);
      return;
    }

    const newGoalIndex = goalIndex + increment;
    if (newGoalIndex < filteredGoals.length) {
      setGoalIndex(newGoalIndex);
      return;
    }

    if (goalId) {
      history.replace('/goals');
    } else {
      setDone(true);
    }
  }, [goals.length, filteredGoals, goalId, goalIndex, history]);

  useEffect(() => {
    if (filteredGoals && goalIndex < 0) goToGoal();
  }, [filteredGoals, goToGoal, goalIndex]);

  const handleSubmit = async (increment: number) => {
    if (!currentGoal) return;
    const haveSingleGoal = !!goalId;
    const todaysAnswer = currentGoal.todays_answer;
    try {
      if ((haveSingleGoal || isPostMode) && todaysAnswer) {
        await dispatch(updateAnswer(currentGoal, candidateValue));
        if (isPostMode) {
          goToGoal(increment);
        } else {
          history.goBack();
        }
      } else if (haveSingleGoal) {
        await dispatch(createAnswer(currentGoal, candidateValue));
        history.goBack();
      }
    } catch (e) {
      enqueueSnackbar(`Failed to save answer: ${extractError(e)}`, { variant: 'error' });
    }
  };

  const PageContent = () => {
    if (done) {
      return <AnswerEmpty />;
    }
    const loading = isLoading || !filteredGoals;
    return (
      <Form loading={loading} onSubmit={() => handleSubmit(1)}>
        <Header as="h3">
          {currentGoal
            ? `Did I ${firstCase(currentGoal.question)}?`
            : 'Loading Goal...'}
          <GoalProgressCount />
        </Header>
        <FormContent />
      </Form>
    );
  };

  const handlePreAnswer = async (answerValue: number) => {
    if (!currentGoal) return;
    await dispatch(createAnswer(currentGoal, answerValue));
    goToGoal();
  };

  const FormContent = () => {
    if (isLoading || !currentGoal) {
      return <PlaceholderSet/>;
    }

    if (isPostMode || goalId) {
      return (
        <AnswerPost
          goal={currentGoal}
          onAnswer={setCandidateValue}
          checkedValue={candidateValue}
          mode={isPostMode ? 'post' : 'single'}
          isStart={goalIndex === 0}
          isEnd={filteredGoals
          && goalIndex === filteredGoals.length - 1}
          goBack={() => handleSubmit(-1)}
        />
      );
    }
    return <AnswerPre goal={currentGoal} onAnswer={handlePreAnswer} />;
  };

  const GoalProgressCount = () => {
    if (goalId) {
      return null;
    }

    const filteredGoalLength = filteredGoals?.length || '--';
    return (
      <Header.Subheader>
        {goalIndex + 1}
        {' '}
        /
        {' '}
        {filteredGoalLength}
      </Header.Subheader>
    );
  };

  return (
    <div>
      <BreadcrumbSet sections={sections} />
      <HeaderBar title="Answer Goals" icon="goals" />
      <PageContent />
    </div>
  );
};

export default Answer;