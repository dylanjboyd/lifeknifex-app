import { fireEvent, screen, waitFor } from '@testing-library/react';
import { EnhancedStore } from '@reduxjs/toolkit';
import * as backend from '../../backend';
import { RootState } from '../../redux/rootReducer';
import {
  addConsumptionToStore,
  addFoodToStore,
  getTestStore,
  renderNode,
  setConsumptionResponse,
  setUpMockBackend,
} from '../../testUtils';

jest.mock('./../../backend');
const mockBackend = backend as jest.Mocked<typeof backend>;
const routeUrl = '/nutrition';
let store: EnhancedStore<RootState>;
const emptyConsumptionMessage = 'You haven\'t logged any consumption yet.';
const emptyFoodMessage = 'You need some food to log.';

describe('NutritionList', () => {
  beforeEach(() => {
    store = getTestStore();
    setUpMockBackend(mockBackend);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show empty consumption list', async () => {
    renderNode(routeUrl, store);
    addFoodToStore(store, 'My food');
    setConsumptionResponse(store);
    await waitFor(() => screen.getByRole('heading', { name: emptyConsumptionMessage }));
  });

  it('should request when not loaded', async () => {
    renderNode(routeUrl, store);
    expect(backend.reqGetAllConsumptions).toBeCalledTimes(1);
    expect(backend.reqGetAllFoods).toBeCalledTimes(1);
  });

  it('should show consumptions', async () => {
    const foodName = 'My food';
    const food = addFoodToStore(store, foodName);
    addConsumptionToStore(store, food);
    renderNode(routeUrl, store);
    await waitFor(() => screen.getByRole('heading', { name: foodName }));
  });

  it('should not perform any requests when loaded', async () => {
    const food = addFoodToStore(store, 'My food');
    addConsumptionToStore(store, food);
    renderNode(routeUrl, store);
    expect(backend.reqGetAllFoods).not.toBeCalled();
    expect(backend.reqGetAllConsumptions).not.toBeCalled();
  });

  it('should navigate when Log clicked with food and without consumptions', async () => {
    addFoodToStore(store, 'My food');
    setConsumptionResponse(store, []);
    renderNode(routeUrl, store);
    fireEvent.click(screen.getByRole('button', { name: 'Get Logging' }));
    await waitFor(() => screen.getByRole('heading', { name: 'Log Consumption' }));
  });

  it('should navigate to new food form with no foods', async () => {
    renderNode(routeUrl, store);
    await waitFor(() => screen.getByRole('heading', { name: emptyFoodMessage }));
    fireEvent.click(screen.getByRole('button', { name: 'New Food' }));
    await waitFor(() => screen.getByRole('heading', { name: 'New Food' }));
  });

  it('changes food empty message to consumption list empty after adding', async () => {
    renderNode(routeUrl, store);
    await waitFor(() => screen.getByRole('heading', { name: emptyFoodMessage }));
    addFoodToStore(store, 'My food');
  });

  // it('should navigate to new food form with foods', async () => {
  //     addFoodToStore(store, 'My food');
  //     renderNode(routeUrl, store);
  //     fireEvent.click(screen.getByRole('button', {name: 'New Food'}));
  //     await waitFor(() => screen.getByRole('heading', {name: 'New Food'}));
  // });
  //
  // it('should navigate to edit food form', async () => {
  //     addFoodToStore(store, 'My food');
  //     renderNode(routeUrl, store);
  //     fireEvent.click(screen.getByRole('button', {name: 'Edit'}));
  //     await waitFor(() => screen.getByRole('heading', {name: 'Edit Food'}));
  // });
  //
  // it('should show an empty archived message', async () => {
  //     renderNode(routeUrl, store);
  //     fireEvent.click(screen.getByRole('checkbox'));
  //     await waitFor(() => screen.getByRole('heading', {name: 'No archived foods for you!'}));
  // });
  //
  // it('should show archived foods', async () => {
  //     const foodName = 'My food';
  //     addFoodToStore(store, foodName, true)
  //     renderNode(routeUrl, store);
  //     await waitFor(() => screen.getByRole('heading', {name: emptyConsumptionMessage}));
  //     fireEvent.click(screen.getByRole('checkbox'));
  //     await waitFor(() => screen.getByRole('heading', {name: foodName}));
  // });
});
