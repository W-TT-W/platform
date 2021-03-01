import { createLocalVue, shallowMount } from '@vue/test-utils';
import 'src/module/sw-settings-search/component/sw-settings-search-searchable-content-customfields';
import 'src/app/component/entity/sw-entity-listing';
import 'src/app/component/data-grid/sw-data-grid';
import 'src/app/component/data-grid/sw-data-grid-skeleton';

const customFields = mockCustomFieldData();

function mockCustomFieldData() {
    const _customFields = [];

    for (let i = 0; i < 10; i += 1) {
        const customField = {
            id: `id${i}`,
            name: `custom_additional_field_${i}`,
            config: {
                label: { 'en-GB': `Special field ${i}` },
                customFieldType: 'checkbox',
                customFieldPosition: i + 1
            }
        };

        _customFields.push(customField);
    }

    return _customFields;
}

function mockCustomFieldRepository() {
    class Repository {
        constructor() {
            this._customFields = customFields;
        }

        search() {
            const response = this._customFields;
            response.total = this._customFields.length;

            response.sort((a, b) => a.config.customFieldPosition - b.config.customFieldPosition);

            return Promise.resolve(this._customFields);
        }

        save(field) {
            if (field.id === 'id1337') {
                this._customFields.push(field);
            }

            return Promise.resolve();
        }
    }

    return new Repository();
}

function createWrapper() {
    const localVue = createLocalVue();

    return shallowMount(Shopware.Component.build('sw-settings-search-searchable-content-customfields'), {
        localVue,

        mocks: {
            $tc: key => key,
            $route: {
                query: {
                    page: 1,
                    limit: 25
                }
            },
            $device: {
                onResize: () => {}
            }
        },

        provide: {
            repositoryFactory: {
                create() {
                    return mockCustomFieldRepository();
                }
            }
        },

        stubs: {
            'sw-empty-state': true,
            'sw-entity-listing': Shopware.Component.build('sw-entity-listing'),
            'sw-data-grid': Shopware.Component.build('sw-data-grid'),
            'sw-pagination': true,
            'sw-data-grid-skeleton': Shopware.Component.build('sw-data-grid-skeleton'),
            'sw-context-button': true
        },

        propsData: {
            isEmpty: false,
            columns: [],
            repository: {},
            fieldConfigs: []
        }
    });
}

describe('module/sw-settings-search/component/sw-settings-search-searchable-content-customfields', () => {
    it('should be a Vue.JS component', async () => {
        const wrapper = createWrapper();
        await wrapper.vm.$nextTick();

        expect(wrapper.vm).toBeTruthy();
    });

    it('should render empty state when isEmpty variable is true', async () => {
        const wrapper = createWrapper();

        await wrapper.setProps({
            isEmpty: true
        });

        expect(wrapper.find('sw-empty-state-stub').exists()).toBeTruthy();
    });

    it('Should call to remove function when click to remove action', async () => {
        const wrapper = createWrapper();
        await wrapper.vm.$nextTick();
        wrapper.vm.onRemove = jest.fn();

        await wrapper.setProps({
            searchConfigs: [
                {
                    apiAlias: null,
                    createdAt: '2021-01-29T02:18:11.171+00:00',
                    customFieldId: '123456',
                    field: 'categories.customFields',
                    id: '8bafeb17b2494781ac44dce2d3ecfae5',
                    ranking: 0,
                    searchConfigId: '61168b0c1f97454cbee670b12d045d32',
                    searchable: false,
                    tokenize: false
                }
            ],
            isLoading: false
        });

        const firstRow = wrapper.find(
            '.sw-data-grid__row.sw-data-grid__row--0'
        );

        await firstRow.find(
            '.sw-settings-search__searchable-content-list-remove'
        ).trigger('click');

        expect(wrapper.vm.onRemove).toHaveBeenCalled();
    });

    it('Should emitted to delete-config when call the remove function ', async () => {
        const wrapper = createWrapper();
        await wrapper.vm.$nextTick();

        await wrapper.setProps({
            searchConfigs: [
                {
                    apiAlias: null,
                    createdAt: '2021-01-29T02:18:11.171+00:00',
                    customFieldId: '8bafeb17b2494781ac44dce2d3ecfae2',
                    field: 'categories.customFields',
                    id: '8bafeb17b2494781ac44dce2d3ecfae5',
                    ranking: 0,
                    searchConfigId: '61168b0c1f97454cbee670b12d045d32',
                    searchable: false,
                    tokenize: false
                }
            ],
            isLoading: false
        });

        await wrapper.vm.onRemove({
            field: 'categories.customFields',
            id: '8bafeb17b2494781ac44dce2d3ecfae5'
        });
        expect(wrapper.emitted('config-delete')).toBeTruthy();
    });

    it('Should call to reset ranking function when click to reset ranking action', async () => {
        const wrapper = createWrapper();
        await wrapper.vm.$nextTick();
        wrapper.vm.onResetRanking = jest.fn();

        await wrapper.setProps({
            searchConfigs: [
                {
                    apiAlias: null,
                    createdAt: '2021-01-29T02:18:11.171+00:00',
                    customFieldId: '3bafeb17b2494781ac44dce2d3ecfae4',
                    field: 'categories.customFields',
                    id: '8bafeb17b2494781ac44dce2d3ecfae5',
                    ranking: 0,
                    searchConfigId: '61168b0c1f97454cbee670b12d045d32',
                    searchable: false,
                    tokenize: false
                }
            ],
            isLoading: false
        });
        const firstRow = wrapper.find(
            '.sw-data-grid__row.sw-data-grid__row--0'
        );

        await firstRow.find(
            '.sw-settings-search__searchable-content-list-reset'
        ).trigger('click');

        expect(wrapper.vm.onResetRanking).toHaveBeenCalled();
    });

    it('Should emitted to save-config when call the reset ranking function', async () => {
        const wrapper = createWrapper();
        await wrapper.vm.$nextTick();

        await wrapper.setProps({
            searchConfigs: [
                {
                    apiAlias: null,
                    createdAt: '2021-01-29T02:18:11.171+00:00',
                    customFieldId: '23168b0c1f97454cbee670b12d045d32',
                    field: 'categories.customFields',
                    id: '8bafeb17b2494781ac44dce2d3ecfae5',
                    ranking: 0,
                    searchConfigId: '61168b0c1f97454cbee670b12d045d32',
                    searchable: false,
                    tokenize: false
                }
            ],
            isLoading: false
        });

        await wrapper.vm.onResetRanking({
            field: 'categories.customFields',
            id: '8bafeb17b2494781ac44dce2d3ecfae5'
        });

        expect(wrapper.emitted('config-save')).toBeTruthy();
    });
});