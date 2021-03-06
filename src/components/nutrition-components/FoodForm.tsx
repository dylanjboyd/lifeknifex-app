import React, { useEffect, useState } from 'react';
import './FoodForm.scss';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Confirm, Divider, Dropdown, Form, Radio, } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { healthStrings } from '../../Utils';
import { APP_TITLE, foodIcons } from '../../constants';
import { RootState } from '../../redux/rootReducer';
import { selectFoodById, selectFoodsLoading } from '../../features/foods/foodSelectors';
import { createFood, fetchFood, updateFood } from '../../features/foods/foodSlice';
import BreadcrumbSet from '../common-components/BreadcrumbSet';
import HeaderBar from '../common-components/HeaderBar';

const URL_NUTRITION_LIBRARY = '/nutrition/library';

interface IFoodFormParams {
  foodId?: string;
}

const FoodForm: React.FC = () => {
  const dispatch = useDispatch();
  const snackbar = useSnackbar();
  const params = useParams<IFoodFormParams>();
  const foodId = Number(params.foodId);
  const history = useHistory();
  const [isArchiveVisible, setIsArchiveVisible] = useState(false);
  const [isUnarchiveVisible, setIsUnarchiveVisible] = useState(false);
  const isLoading = useSelector(selectFoodsLoading);
  const food = useSelector((state: RootState) => selectFoodById(state, foodId));
  const generateBlankFood = () => ({ name: '', health_index: 0, icon: '' });
  const [draftFood, setDraftFood] = useState(food || generateBlankFood());
  const [errorOnFood, setErrorOnFood] = useState(false);
  const [errorOnHealthIndex, setErrorOnHealthIndex] = useState(false);

  useEffect(() => {
    if (foodId && !food) dispatch(fetchFood(foodId));
  }, [food, foodId, dispatch]);

  useEffect(() => {
    if (food) setDraftFood(food);
  }, [food]);

  const handleSave = async () => {
    if (!draftFood.name) {
      setErrorOnFood(true);
      snackbar.enqueueSnackbar('Food requires a name', { variant: 'error' });
      return;
    }
    setErrorOnFood(false);

    if (!draftFood.health_index) {
      setErrorOnHealthIndex(true);
      snackbar.enqueueSnackbar('Food requires a quality', { variant: 'error' });
      return;
    }
    setErrorOnHealthIndex(false);

    const submitFunction = foodId ? updateFood : createFood;
    try {
      await dispatch(submitFunction(draftFood));
    } catch (e) {
      if (e.message) snackbar.enqueueSnackbar(`Error when saving: ${e.message}`, { variant: 'error' });
      return;
    }
    snackbar.enqueueSnackbar(`Food "${draftFood.name}" saved`, { variant: 'success' });
    if (history.length > 1) history.goBack();
    else history.push('/nutrition/library');
  };

  const SetArchivedButton = () => {
    if (food?.id && !food.is_archived) {
      return (
        <Button
          type="button"
          basic
          floated="right"
          color="red"
          onClick={() => setIsArchiveVisible(true)}
        >
          Archive
        </Button>
      );
    }
    if (food?.id && food.is_archived) {
      return (
        <Button
          type="button"
          basic
          floated="right"
          onClick={() => setIsUnarchiveVisible(true)}
        >
          Unarchive
        </Button>
      );
    }
    return null;
  };

  const toggleArchived = () => setDraftFood({ ...draftFood, is_archived: !draftFood.is_archived });

  const actionWord = foodId ? 'Edit' : 'New';
  const sections = [
    { name: 'Nutrition', href: '/nutrition' },
    { name: actionWord },
  ];

  return (
    <div>
      <BreadcrumbSet sections={sections} />
      <HeaderBar title={`${actionWord} Food`} icon="nutrition" />
      <Form onSubmit={handleSave} loading={isLoading}>
        <Form.Field error={errorOnFood}>
          <label htmlFor="name">Name</label>
          <Form.Input
            id="name"
            autoFocus
            value={draftFood.name}
            onChange={(e) => setDraftFood({ ...draftFood, name: e.target.value })}
          />
        </Form.Field>
        <Form.Field error={errorOnHealthIndex}>
          <Form.Field>
            <label>Quality</label>
          </Form.Field>
          {
                    healthStrings.map((label: string, index: number) => (
                      <Form.Field key={label}>
                        <Radio
                          label={<label htmlFor={`radio_${label}`}>{label}</label>}
                          id={`radio_${label}`}
                          name="healthRadios"
                          value={index + 1}
                          checked={draftFood?.health_index === index + 1}
                          onChange={(
                            e, d,
                          ) => setDraftFood({ ...draftFood, health_index: d.value as number })}
                        />
                      </Form.Field>
                    ))
                }
        </Form.Field>
        <Form.Field>
          <label>Icon</label>
          <Dropdown
            search
            clearable
            selection
            options={foodIcons}
            onChange={(e, d) => setDraftFood({ ...draftFood, icon: d.value as string })}
            value={food?.icon}
          />
        </Form.Field>
        <Divider hidden />
        <Button.Group>
          <Button as={Link} to={URL_NUTRITION_LIBRARY}>Cancel</Button>
          <Button.Or />
          <Button positive type="submit">Save Food</Button>
        </Button.Group>
        <SetArchivedButton />
      </Form>
      <Confirm
        open={isArchiveVisible}
        onCancel={() => setIsArchiveVisible(false)}
        onConfirm={toggleArchived}
        header="Archive Food?"
        content={`Archived foods do not show in searches for consumptions. Previous consumptions will remain unaffected. Archiving food does not delete it from ${APP_TITLE}, and you can restore it from the archive at any time.`}
      />
      <Confirm
        open={isUnarchiveVisible}
        onCancel={() => setIsUnarchiveVisible(false)}
        onConfirm={toggleArchived}
        header="Unarchive Food?"
        content="This food will appear in your list of available foods when logging consumption. You can archive this food again at any time."
      />
    </div>
  );
};

export default FoodForm;
