import {Link} from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import {Button, Card, Divider, Header, Icon, Image, Label} from 'semantic-ui-react';
import * as constants from '../../constants';
import {APP_TITLE} from '../../constants';
import RequestComponent from '../common/RequestComponent/RequestComponent';
import './Home.scss';

class Home extends RequestComponent {
    comingSoonBadge = <Card.Meta><Label><Icon name='gem'/> Coming Soon</Label></Card.Meta>;
    alphaBadge = <Card.Meta><Label size='small'><Icon name='bug'/> Alpha</Label></Card.Meta>;
    betaBadge = <Card.Meta><Label size='small'><Icon name='bug'/> Beta</Label></Card.Meta>;

    render() {
        document.title = `Home - ${APP_TITLE}`;
        return <div>
            <Header
                as='h2'
                content='LifeKnifeX'
                subheader='The swiss army knife of personal order'
            />
            <Divider hidden/>
            <Card.Group centered>
                <Card color={constants.COLOR_NUTRITION}>
                    <Card.Content>
                        <Image src='/img/undraw_pizza_sharing.svg'/>
                        <Card.Header>Nutrition</Card.Header>
                        <Card.Meta>{this.betaBadge}</Card.Meta>
                        <Card.Description>
                            Logging what you eat and drink is the first step to becoming healthier, little by little.
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Button animated='vertical' as={Link} to='/nutrition' color={constants.COLOR_NUTRITION}>
                            <Button.Content visible>Visit</Button.Content>
                            <Button.Content hidden>
                                <Icon name='food'/>
                            </Button.Content>
                        </Button>
                        <Button animated='vertical' as={Link} to='/nutrition/log' basic>
                            <Button.Content visible>Log</Button.Content>
                            <Button.Content hidden>
                                <Icon name='plus'/>
                            </Button.Content>
                        </Button>
                        <Button animated='vertical' as={Link} to='/nutrition/library' basic>
                            <Button.Content visible>Library</Button.Content>
                            <Button.Content hidden>
                                <Icon name='book'/>
                            </Button.Content>
                        </Button>
                    </Card.Content>
                </Card>

                <Card color={constants.COLOR_GOALS}>
                    <Card.Content>
                        <Image src='/img/undraw_i_can_fly_7egl.svg'/>
                        <Card.Header>Goals</Card.Header>
                        <Card.Description>
                            If you have an aspiration to achieve something big in life, start here. Every bit counts.
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        {this.comingSoonBadge}
                    </Card.Content>
                </Card>

                <Card color={constants.COLOR_CAREER}>
                    <Card.Content>
                        <Image src='/img/undraw_career_progress_ivdb.svg'/>
                        <Card.Header>Career</Card.Header>
                        <Card.Description>
                            If you don&apos;t track how well you&apos;re doing in your job, how will you see
                            improvement? Start here.
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        {this.comingSoonBadge}
                    </Card.Content>
                </Card>

                <Card color={constants.COLOR_MOOD}>
                    <Card.Content>
                        <Image src='/img/undraw_mindfulness_scgo.svg'/>
                        <Card.Header>Mood</Card.Header>
                        <Card.Description>
                            If there&apos;s one thing that counts more than emotions, it&apos;s your mood. Don&apos;t
                            let it run you over.
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        {this.comingSoonBadge}
                    </Card.Content>
                </Card>

                <Card color={constants.COLOR_SCORE}>
                    <Card.Content>
                        <Image src='/img/undraw_checking_boxes_2ibd.svg'/>
                        <Card.Header>Score</Card.Header>
                        <Card.Description>
                            There&apos;s no reason why organisation shouldn&apos;t be fun! Keep track of your progress
                            and success here.
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        {this.comingSoonBadge}
                    </Card.Content>
                </Card>

                <Card color={constants.COLOR_ACCOUNT}>
                    <Card.Content>
                        <Image src='/img/undraw_security_o890.svg'/>
                        <Card.Header>Account</Card.Header>
                        <Card.Meta>{this.alphaBadge}</Card.Meta>
                        <Card.Description>
                            Need to log out, or manage your account? Get all of your paperwork and maintenance done
                            here.
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Button animated='vertical' as={Link} to='/account' color={constants.COLOR_ACCOUNT}>
                            <Button.Content visible>Visit</Button.Content>
                            <Button.Content hidden>
                                <Icon name='user'/>
                            </Button.Content>
                        </Button>
                    </Card.Content>
                </Card>
            </Card.Group>
        </div>;
    }
}

Home.propTypes = {
    history: PropTypes.object
};

export default Home;