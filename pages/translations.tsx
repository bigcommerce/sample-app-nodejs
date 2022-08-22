import { Box, Button, Flex, FlexItem, Form, FormGroup, H4, MultiSelect, Panel, Select, Textarea } from '@bigcommerce/big-design';
import { SwapHorizIcon } from '@bigcommerce/big-design-icons';
import { AEFlagIcon, CNFlagIcon, DEFlagIcon, ESFlagIcon, FRFlagIcon, GBFlagIcon, JPFlagIcon, PTFlagIcon, RUFlagIcon } from '@bigcommerce/big-design-icons/flags';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
// import ErrorMessage from '../components/error';
// import Loading from '../components/loading';

const Translations = ({ data }) => {
    // const { error, isLoading, summary } = useProducts();

    // if (isLoading) return <Loading />;
    // if (error) return <ErrorMessage error={error} />;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [exampleWebpage, setExampleWebPage] = useState('');
    const [defaultLanguage, setDefaultLanguage] = useState('');
    const [savedLanguages, setSavedLanguages] = useState([]);
    const [value, setValue] = useState([]);
    const [leftLanguage, setLeftLanguage] = useState([]);
    const [rightLanguage, setRightLanguage] = useState([]);
    const [webPageTranslationLanguage, setWebPageTranslationLanguage] = useState([]);

    const listOfLanguages = [
        { value: 'en-English', content: 'English', disabled: false },
        { value: 'zh-Chinese', content: 'Chinese' },
        { value: 'es-Spanish', content: 'Spanish' },
        { value: 'ar-Arabic', content: 'Arabic' },
        { value: 'de-German', content: 'German' },
        { value: 'pt-Portuguese', content: 'Portuguese' },
        { value: 'ru-Russian', content: 'Russian' },
        { value: 'fr-French', content: 'French' },
        { value: 'ja-Japanese', content: 'Japanese' },
    ]

    useEffect(() => {
        if (data) {
            setExampleWebPage(data);

            const fragment = document.createRange().createContextualFragment(data);
            document.querySelector('.example-box')?.appendChild(fragment)
        }
    }, [data])

    const handleChange = (val) => setValue(val);

    const findRelevantFlag = (languageCode) => {
        switch (languageCode) {
            case 'en':
                return <GBFlagIcon />;
            case 'zh':
                return <CNFlagIcon />;
            case 'es':
                return <ESFlagIcon />;
            case 'ar':
                return <AEFlagIcon />;
            case 'de':
                return <DEFlagIcon />;
            case 'pt':
                return <PTFlagIcon />;
            case 'ru':
                return <RUFlagIcon />;
            case 'fr':
                return <FRFlagIcon />;
            case 'ja':
                return <JPFlagIcon />;
        }
    }

    const swapLanguages = () => {
        const newRight = leftLanguage;
        const newLeft = rightLanguage;
        setLeftLanguage(newLeft);
        setRightLanguage(newRight);
    }

    return (
        <>
            <Panel header="Translations" id="translations">
                <Flex>
                    <FlexItem flexGrow={2}>
                        <StyledBox border="box" borderRadius="normal" marginRight="xLarge" padding="medium">
                            <Form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    setSavedLanguages(value);
                                }}
                            >
                                <FormGroup>
                                    <Select
                                        filterable={true}
                                        label="Default Langauage"
                                        maxHeight={300}
                                        onOptionChange={(value) => { setDefaultLanguage(value) }}
                                        options={[
                                            { value: 'en-English', content: 'English' },
                                            { value: 'zh-Chinese', content: 'Chinese' },
                                            { value: 'es-Spanish', content: 'Spanish' },
                                            { value: 'ar-Arabic', content: 'Arabic' },
                                            { value: 'de-German', content: 'German' },
                                            { value: 'pt-Portuguese', content: 'Portuguese' },
                                            { value: 'ru-Russian', content: 'Russian' },
                                            { value: 'fr-French', content: 'French' },
                                            { value: 'ja-Japanese', content: 'Japanese' },
                                        ]}
                                        placeholder={'Choose Language'}
                                        placement={'bottom-start'}
                                        required
                                        value={defaultLanguage}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <MultiSelect
                                        filterable={true}
                                        label="Languages"
                                        maxHeight={300}
                                        onOptionsChange={handleChange}
                                        options={listOfLanguages.map((language) => {
                                            if (language.value === defaultLanguage) {
                                                language.disabled = true;
                                            }

                                            return language;
                                        })}
                                        placeholder={'Choose Language(s)'}
                                        placement={'bottom-start'}
                                        required
                                        value={value}
                                    />
                                </FormGroup>
                                <Box marginTop="xxLarge">
                                    <Button type="submit">Save Selection</Button>
                                </Box>
                            </Form>
                        </StyledBox>
                    </FlexItem>
                    <FlexItem flexGrow={2}>
                        <StyledBox border="box" borderRadius="normal" marginRight="xLarge" padding="medium">
                            <H4>Selected Languages</H4>
                            {[defaultLanguage + ' (Default)', ...savedLanguages].map((language, index) => {
                                const languageCode = language.split('-')[0];
                                const languageText = language.split('-')[1];
                                const flag = findRelevantFlag(languageCode);

                                return <H4 key={index}>{flag} {languageText}</H4>
                            })}
                        </StyledBox>
                    </FlexItem>
                </Flex>
            </Panel>
            <Panel header='Example of Translations' id='example-area'>
                <Flex>
                    <StyledBox border="box" borderRadius="normal" marginRight="xLarge" padding="medium">
                        <Form
                            onSubmit={(e) => {
                                e.preventDefault()
                            }}
                        >
                            <Flex alignItems="center" flexColumnGap="10px" marginBottom="large">
                                <FlexItem>
                                    <FormGroup>
                                        <Select
                                            filterable={true}
                                            label="From"
                                            maxHeight={300}
                                            onOptionChange={(value) => setLeftLanguage(value)}
                                            options={[defaultLanguage, ...savedLanguages].map((language) => {
                                                return { value: language, content: language.split('-')[1] }
                                            })}
                                            placeholder={'Choose a language'}
                                            placement={'bottom-start'}
                                            required
                                            value={leftLanguage}
                                        />
                                    </FormGroup>
                                </FlexItem>
                                <FlexItem paddingTop="large">
                                    <SwapHorizIcon onClick={() => swapLanguages()} title="Swap Values" />
                                </FlexItem>
                                <FlexItem>
                                    <FormGroup>
                                        <Select
                                            filterable={true}
                                            label="To"
                                            maxHeight={300}
                                            onOptionChange={(value) => setRightLanguage(value)}
                                            options={[defaultLanguage, ...savedLanguages].map((language) => {
                                                return { value: language, content: language.split('-')[1] }
                                            })}
                                            placeholder={'Choose a language'}
                                            placement={'bottom-start'}
                                            required
                                            value={rightLanguage}
                                        />
                                    </FormGroup>
                                </FlexItem>
                            </Flex>
                            <Flex>
                                <FlexItem flexGrow={2} marginRight="small">
                                    <FormGroup>
                                        <Textarea
                                            label="Input"
                                            placeholder="Enter some text..."
                                            resize={false}
                                            required
                                            rows={7}
                                        />
                                    </FormGroup>
                                </FlexItem>
                                <FlexItem flexGrow={2}>
                                    <FormGroup>
                                        <Textarea
                                            label="Output"
                                            resize={false}
                                            disabled
                                            required
                                            rows={7}
                                        />
                                    </FormGroup>
                                </FlexItem>
                            </Flex>
                            <FlexItem>
                                <Box marginTop="xxLarge">
                                    <Button type="submit">Translate</Button>
                                </Box>
                            </FlexItem>
                        </Form>
                    </StyledBox>
                    <FlexItem flexGrow={2}>
                        <StyledBox border="box" borderRadius="normal" marginRight="xLarge" padding="medium" >
                            <H4>Webpage Preview</H4>
                            <FlexItem>
                                    <FormGroup>
                                        <Select
                                            filterable={true}
                                            label="Language"
                                            maxHeight={300}
                                            onOptionChange={(value) => setWebPageTranslationLanguage(value)}
                                            options={savedLanguages.map((language) => {
                                                return { value: language, content: language.split('-')[1] }
                                            })}
                                            placeholder={'Choose a language'}
                                            placement={'bottom-start'}
                                            required
                                            value={webPageTranslationLanguage}
                                        />
                                    </FormGroup>
                                </FlexItem>
                            <Box backgroundColor="secondary10" padding="xxLarge" shadow="floating" className='example-box'>
                            </Box>
                        </StyledBox>
                    </FlexItem>
                </Flex>
            </Panel>
        </>
    );
};

const StyledBox = styled(Box)`
    min-width: 10rem;
`;

export default Translations;

export async function getServerSideProps() {
    const res = await fetch(`https://www.google.co.uk`);
    const data = await res.text();

    if (!data) {
        return {
            notFound: true,
        }
    }

    return {
        props: { data }, // will be passed to the page component as props
    }
}