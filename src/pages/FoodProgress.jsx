import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import ReactPlayer from 'react-player';
import ButtonFavorite from '../components/ButtonFavorite';
import recipesContext from '../context/recipesContext';
import ButtonShare from '../components/ButtonShare';
import getFoodRecipeAPI from '../services/getFoodRecipeAPI';
import { ButtonRecipe } from '../styles/buttons';
import { RecipesContainer, BackgroundRecipe, HeadingRecipe, HeadingTitle,
  HeadingButtons, SideBySideList } from '../styles/recipes';
import { Title, Subtitle, Paragraph } from '../styles/index';

function FoodProgress() {
  const history = useHistory();
  const { id } = useParams();
  const { updateRecipesInProgressFood } = useContext(recipesContext);
  const [recipe, setRecipe] = useState({});
  const [checkedIngredients, setChecked] = useState({});
  const [disableButton, setDisable] = useState(true);

  const ingredients = Object.entries(recipe)
    .reduce((acc, ingredient) => {
      if (ingredient[0].includes('strIngredient') && ingredient[1]) {
        acc.push(ingredient[1]);
      }
      return acc;
    }, []);

  useEffect(() => {
    const verify = Object.values(checkedIngredients);
    setDisable(true);
    if (!verify.includes(false)) {
      setDisable(false);
    }
  }, [checkedIngredients]);

  useEffect(() => { // Recover previous checked ingredients
    const initialCheckedState = {};
    ingredients.forEach((ing) => {
      initialCheckedState[ing] = false;
    });
    console.log(initialCheckedState);
    setChecked(initialCheckedState);

    const recipesInProgress = JSON.parse(localStorage.getItem('inProgressRecipes'));
    if (recipesInProgress === null) {
      updateRecipesInProgressFood(id, ingredients);
      const recipeStorage = JSON.parse(localStorage.getItem('inProgressRecipes'));
      const recipeCooking = recipeStorage.meals[id];
      const isChecked = recipeCooking.checkedIngredients;
      return setChecked(isChecked);
    }
    const recipeCooking = recipesInProgress.meals[id];
    const isChecked = recipeCooking.checkedIngredients;
    console.log(isChecked);
    setChecked(isChecked);
  }, [recipe]);

  useEffect(() => {
    const fetchFoodDetails = async () => {
      const res = await getFoodRecipeAPI(id);
      setRecipe(res);
    };
    fetchFoodDetails();
  }, [id]);

  // const verifyFinishButton = () => {

  // };

  const handleCheckIngredient = ({ target }) => {
    const { checked, id: name } = target;
    const recipesInProgress = JSON.parse(localStorage.getItem('inProgressRecipes'));
    const getRecipe = recipesInProgress.meals[id].checkedIngredients;
    setChecked({ ...checkedIngredients, [name]: checked });

    localStorage.setItem('inProgressRecipes', JSON.stringify({ // Set the checked ingredient to the localStorage
      ...recipesInProgress,
      meals: {
        ...recipesInProgress.meals,
        [id]: {
          ...recipesInProgress.meals[id],
          checkedIngredients: {
            ...getRecipe,
            [name]: checked,
          },
        },
      },
    }));
  };

  const handleClickToStopRecipe = () => {
    const date = new Date();
    // This reference was used to do the date function https://www.horadecodar.com.br/2021/04/03/como-pegar-a-data-atual-com-javascript/
    const fullDate = {
      day: String(date.getDate()).padStart(2, '0'),
      month: String(date.getMonth() + 1).padStart(2, '0'),
      year: date.getFullYear(),
    };
    const wholeDate = `${fullDate.day}/${fullDate.month}/${fullDate.year}`;
    const recover = JSON.parse(localStorage.getItem('doneRecipes'));
    const { strArea: nationality, strCategory: category,
      strMeal: name, strMealThumb: image, strTags: tags } = recipe;
    if (recover !== null) {
      localStorage.setItem('doneRecipes', JSON.stringify([
        ...recover,
        {
          id,
          type: 'food',
          nationality,
          category,
          alcoholicOrNot: '',
          name,
          image,
          doneDate: wholeDate,
          tags: [tags],
        },
      ]));
      return history.push('/done-recipes');
    }
    localStorage.setItem('doneRecipes', JSON.stringify([
      {
        id,
        type: 'food',
        nationality,
        category,
        alcoholicOrNot: '',
        name,
        image,
        doneDate: wholeDate,
        tags: [tags],
      },
    ]));
    history.push('/done-recipes');
  };

  const measures = Object.entries(recipe)
    .reduce((acc, measure) => {
      if (measure[0].includes('strMeasure') && measure[1]) {
        acc.push(measure[1]);
      }
      return acc;
    }, []);

  return (
    <RecipesContainer>
      <BackgroundRecipe img={ recipe.strMealThumb } />

      <HeadingRecipe>
        <HeadingTitle>
          <Title fontSize="2.5rem" data-testid="recipe-title">{recipe.strMeal}</Title>
          <Subtitle
            fontSize="1.3rem"
            data-testid="recipe-category"
          >
            {recipe.strCategory}
          </Subtitle>
        </HeadingTitle>

        <HeadingButtons>

          <ButtonFavorite recipe={ recipe } type="food" />
          <ButtonShare />

        </HeadingButtons>
      </HeadingRecipe>

      <SideBySideList>
        <div>
          {ingredients.map((ingredient, index) => {
            const divisorNumber = parseInt(ingredients.length / 2, 10);
            let sideOne;
            if (index < divisorNumber) {
              sideOne = (
                <label
                  key={ ingredient }
                  htmlFor={ ingredient }
                  data-testid={ `${index}-ingredient-step` }
                  className="ingredient"
                >
                  <input
                    id={ ingredient }
                    type="checkbox"
                    onChange={ handleCheckIngredient }
                    checked={ checkedIngredients[ingredient] }
                  />
                  <span>{ingredient}</span>
                  <span>{measures[index]}</span>
                </label>
              );
            }
            return (sideOne);
          })}
        </div>
        <div>
          {ingredients.map((ingredient, index) => {
            const divisorNumber = parseInt(ingredients.length / 2, 10);
            let sideTwo;
            if (index > divisorNumber) {
              sideTwo = (
                <label
                  key={ ingredient }
                  htmlFor={ ingredient }
                  data-testid={ `${index}-ingredient-step` }
                  className="ingredient"
                >
                  <input
                    id={ ingredient }
                    type="checkbox"
                    onChange={ handleCheckIngredient }
                    checked={ checkedIngredients[ingredient] }
                  />
                  <span>{ingredient}</span>
                  <span>{measures[index]}</span>
                </label>
              );
            }
            return (sideTwo);
          })}
        </div>
      </SideBySideList>

      <Paragraph data-testid="instructions">{ recipe.strInstructions }</Paragraph>

      <ReactPlayer width="100%" height="40vh" url={ recipe.strYoutube } />

      <ButtonRecipe
        type="button"
        data-testid="finish-recipe-btn"
        className="recipeButton finish"
        onClick={ handleClickToStopRecipe }
        disabled={ disableButton }
        btnType="finish"
      >
        <span>Finish Recipe</span>
      </ButtonRecipe>

    </RecipesContainer>
  );
}

export default FoodProgress;
