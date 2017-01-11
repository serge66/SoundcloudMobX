
import React, { Component, PropTypes } from 'react';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {
    View,
    Text,
    ListView,
    StyleSheet,
    Dimensions,
    InteractionManager,
    TouchableOpacity,
    Image,
} from 'react-native';

export default class PlayList extends Component {

    static propTypes = {
        list: PropTypes.array.isRequired,
        current: PropTypes.object.isRequired,
        play: PropTypes.func.isRequired,
    };

    offset = {};

    human(number) {

        if (number > 1000) {
            return (number / 1000).toFixed(2) + 'K';
        }

        return number;
    }

    highlight(offset = this.offset[this.props.current.id].y) {

        var container = this.refs.container;
        var activeOffset = this.offset[this.props.current.id];

        if (container && activeOffset) {

            offset = offset === void 0 ? activeOffset.y : offset;

            if (this.contentHeight - offset < this.scrollViewHeight) {
                offset = this.contentHeight - this.scrollViewHeight;
            }

            container.scrollTo({
                y: offset,
                animated: false
            });
        }
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.current.id !== this.props.current.id) {
            this.highlight(this.offset[nextProps.current.id].y);
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(this.highlight.bind(this));
    }

    render() {

        var { list, current = {} } = this.props;
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.id !== r2.id
        });
        var index = list.findIndex(e => e.id === current.id);
        var dataSource = ds.cloneWithRows(list.slice());

        return (
            <ListView

            ref="container"

            initialListSize={index + 1}
            removeClippedSubviews={true}
            onContentSizeChange={(w, h) => this.contentHeight = h}
            onLayout={(e) => this.scrollViewHeight = e.nativeEvent.layout.height}

            style={[styles.container, this.props.style]}
            enableEmptySections={true}
            dataSource={dataSource}
            renderRow={song => {

                var active = song.id === current.id;

                return (
                    <TouchableOpacity style={styles.item} onLayout={e => {
                        this.offset[song.id] = e.nativeEvent.layout;
                    }}
                    onPress={e => this.props.play(song)}
                    ref="items">
                        <View>
                            <View>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.title, active && styles.active]}>{song.title}</Text>
                            </View>
                            <View style={styles.meta}>
                                <View style={styles.avatar}>
                                    <Image {...{
                                        source: {
                                            uri: song.user.avatar_url
                                        },

                                        style: {
                                            width: 24,
                                            height: 24,
                                        }
                                    }}></Image>
                                    </View>
                                <Text style={[styles.username, active && styles.active]}>{song.user.username}</Text>

                                <View style={styles.right}>
                                    <Icon name="heart" size={12} style={active && styles.active} color="rgba(255,255,255,.5)"></Icon>
                                    <Text style={[styles.text, active && styles.active]}>{this.human(song.likes_count)}</Text>

                                    <Icon name="bubble" style={active && styles.active} size={12} color="rgba(255,255,255,.5)"></Icon>
                                    <Text style={[styles.text, active && styles.active]}>{this.human(song.comment_count)}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            }}>
            </ListView>
        );
    }
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({

    container: {
        marginTop: 70,
        marginBottom: 140,
        overflow: 'hidden'
    },

    item: {
        height: 58,
        margin: 10,
        marginLeft: 10,
        marginRight: 10,
        borderBottomWidth: .5,
        borderBottomColor: 'rgba(0,0,0,.1)',
        backgroundColor: 'transparent',
    },

    right: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row'
    },

    title: {
        color: 'rgba(255,255,255,.7)'
    },

    username: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: 11,
        color: 'rgba(0,0,0,.2)'
    },

    avatar: {
        marginRight: 6,
        height: 20,
        width: 20,
        borderRadius: 20,
        overflow: 'hidden',
    },

    meta: {
        alignItems: 'center',
        flexDirection: 'row'
    },

    active: {
        color: '#f50'
    },

    text: {
        marginLeft: 4,
        marginRight: 15,
        fontSize: 11,
        color: 'rgba(255,255,255,.5)'
    }
});