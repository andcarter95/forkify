import { async } from 'regenerator-runtime';
import * as model from './model.js'
import { MODAL_CLOSE_SEC } from './Views/config.js';
import recipeView from './Views/recipeView.js';
import searchView from './Views/searchView.js';
import resultsView from './Views/resultsView.js';
import paginationView from './Views/paginationView.js';
import bookmarksView from './Views/bookmarksView.js';
import addRecipeView from './Views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC } from './Views/config.js';

const controlRecipes = async function () {
  try {
  const id =window.location.hash.slice(1)

    if(!id) return
    recipeView.renderSpinner();

    // Update results view to mark selected result
    resultsView.update(model.getSearchResultsPage())
    bookmarksView.update(model.state.bookmarks)
    // Loading Recipe
    await model.loadRecipe(id)
    
    // Rendering Recipe
    recipeView.render(model.state.recipe)
    
  } catch (err) {
    recipeView.renderError()
  }
};

const controlSearchResults = async function(){
  try{
    resultsView.renderSpinner()
    // Get search query
    const query = searchView.getQuery()
    if(!query) return;
    // Load search results
    await model.loadSearchResults(query);
    // Render results
    resultsView.render(model.getSearchResultsPage())

    //Render initial pagination buttons
    paginationView.render(model.state.search)
  } catch(err){
    console.log(err);
  }
}

const controlPagination = function(goToPage){
  // Render new results
  resultsView.render(model.getSearchResultsPage(goToPage))

  //Render new pagination buttons
  paginationView.render(model.state.search)
}

const controlServings = function(newServings){
  //update the recipe servings
  model.updateServings(newServings)
  //update the recipe view
  // recipeView.render(model.state.recipe)
  recipeView.update(model.state.recipe)

}

const controlAddBookmark = function(){
  // Add or remove bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  else{model.deleteBookmark(model.state.recipe.id)}
  // update recipe view
  recipeView.update(model.state.recipe)
  // Render bookmarks
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe= async function(newRecipe){
  try{
    // Show loading spinner
    addRecipeView.renderSpinner()
    // upload the recipe data
    await model.uploadRecipe(newRecipe)
    // render recipe
    recipeView.render(model.state.recipe)
    // success message
    addRecipeView.renderMessage()
    // Render bookmark view
    bookmarksView.render(model.state.bookmarks)
    // Change ID in URL
    window.history.pushState(null,'', `#${model.state.recipe.id}`)
    // close form
    setTimeout(function(){
      addRecipeView._toggleWindow()
    }, MODAL_CLOSE_SEC * 1000)

  } catch(err){
    console.error(err)
    addRecipeView.renderError(err.message)
  }
  
  
}

const init = function(){
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
  addRecipeView.addHandlerUpload(controlAddRecipe)
  
}
init()

