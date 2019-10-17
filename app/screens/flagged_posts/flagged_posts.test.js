// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import Preferences from 'mattermost-redux/constants/preferences';

import * as NavigationActions from 'app/actions/navigation';
import {shallowWithIntl} from 'test/intl-test-helper';

import FlaggedPosts from './flagged_posts';

jest.mock('rn-placeholder', () => ({
    ImageContent: () => {},
}));

describe('FlaggedPosts', () => {
    const baseProps = {
        actions: {
            clearSearch: jest.fn(),
            loadChannelsByTeamName: jest.fn(),
            loadThreadIfNecessary: jest.fn(),
            getFlaggedPosts: jest.fn(),
            selectFocusedPostId: jest.fn(),
            selectPost: jest.fn(),
        },
        theme: Preferences.THEMES.default,
    };

    test('should match snapshot', () => {
        const wrapper = shallowWithIntl(
            <FlaggedPosts {...baseProps}/>
        );

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('should call showSearchModal after awaiting dismissModal on handleHashtagPress', async () => {
        const error = new Error('foo');
        const dismissModal = jest.spyOn(NavigationActions, 'dismissModal');
        const showSearchModal = jest.spyOn(NavigationActions, 'showSearchModal');

        const hashtag = 'test';
        const wrapper = shallowWithIntl(
            <FlaggedPosts {...baseProps}/>
        );

        dismissModal.mockImplementation(async () => {
            throw error;
        });
        let caughtError;
        try {
            await wrapper.instance().handleHashtagPress(hashtag);
        } catch (e) {
            caughtError = e;
        }
        expect(caughtError).toBe(error);
        expect(dismissModal).toHaveBeenCalled();
        expect(showSearchModal).not.toHaveBeenCalled();

        dismissModal.mockImplementation(async () => (Promise.resolve()));
        await wrapper.instance().handleHashtagPress(hashtag);
        expect(dismissModal).toHaveBeenCalled();
        expect(showSearchModal).toHaveBeenCalledWith(`#${hashtag}`);
    });
});