import React from 'react';
import { Button, Card } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { healthStrings } from '../../Utils';
import { COLOR_NUTRITION } from '../../constants';
import FoodImage from '../common-components/FoodImage';
import IFood from '../../models/IFood';

interface IFoodListProps {
  foods: IFood[];
}

const FoodList: React.FC<IFoodListProps> = ({ foods }: IFoodListProps) => (
  <Card.Group>
    {foods.map((food) => (
      <Card key={food.url} color={COLOR_NUTRITION}>
        <Card.Content>
          <FoodImage icon={food.icon} />
          <Card.Header as="h3">{food.name}</Card.Header>
          <Card.Meta>{healthStrings[food.health_index - 1]}</Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <div>
            <Button
              size="tiny"
              basic
              as={Link}
              to={`/nutrition/log?food=${food.id}`}
              color={COLOR_NUTRITION}
            >
              Log
            </Button>
            <Button size="tiny" basic as={Link} to={`/nutrition/library/manage/${food.id}`}>Edit</Button>
          </div>
        </Card.Content>
      </Card>
    ))}
  </Card.Group>
);

export default FoodList;
