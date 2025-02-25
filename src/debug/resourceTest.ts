/**
 * Resource System Test
 * Tests for resource update mechanics
 */

import { store } from '../state/store';
import { ResourceManager } from '../systems/resourceManager';
import { addResourceAmount, updateResourcePerSecond } from '../state/resourcesSlice';

/**
 * Run tests for the resource system
 */
export function runResourceTests() {
  console.group('===== RESOURCE SYSTEM TESTS =====');
  
  // Get current resources
  const state = store.getState();
  const resources = state.resources;
  const resourceManager = ResourceManager.getInstance();
  
  console.log(`Testing with ${Object.keys(resources).length} resources`);
  
  // Test 1: Verify ResourceManager is initialized 
  try {
    console.log('\nTest 1: ResourceManager initialization');
    
    // Indirectly test initialization by calling a method that requires initialization
    const testResourceId = Object.keys(resources)[0];
    const canAfford = resourceManager.canAfford({ [testResourceId]: 0 });
    
    console.log(`ResourceManager initialization test: ${canAfford ? 'PASSED' : 'FAILED'}`);
  } catch (error) {
    console.error('Test 1 failed with error:', error);
  }
  
  // Test 2: Manual resource update
  try {
    console.log('\nTest 2: Manual resource update');
    
    // Store initial values
    const initialValues = Object.entries(resources).map(([id, resource]) => ({
      id,
      name: resource.name,
      amount: resource.amount,
      perSecond: resource.perSecond
    }));
    
    // Ensure we have resources with positive generation
    let hasPositiveGeneration = false;
    initialValues.forEach(resource => {
      if (resource.perSecond > 0) {
        hasPositiveGeneration = true;
        console.log(`Resource ${resource.name} has positive generation: ${resource.perSecond}/s`);
      }
    });
    
    if (!hasPositiveGeneration) {
      console.warn('No resources with positive generation found. Setting test resource...');
      
      // Set a test resource with positive generation
      const testResource = initialValues[0];
      console.log(`Setting ${testResource.name} to generate 1.0/s`);
      
      store.dispatch(updateResourcePerSecond({
        id: testResource.id,
        perSecond: 1.0
      }));
    }
    
    // Apply a manual update (1 second worth)
    console.log('Applying 1 second manual update...');
    resourceManager.updateResources(1.0);
    
    // Check results
    setTimeout(() => {
      const updatedState = store.getState();
      const updatedResources = updatedState.resources;
      
      console.log('Resource changes:');
      initialValues.forEach(initial => {
        const updated = updatedResources[initial.id];
        if (updated) {
          const change = updated.amount - initial.amount;
          const expected = initial.perSecond > 0 ? initial.perSecond * 1.0 : 0;
          
          console.log(`- ${initial.name}: ${initial.amount.toFixed(2)} → ${updated.amount.toFixed(2)} (change: ${change.toFixed(2)}, expected: ${expected.toFixed(2)})`);
          
          // Check if update worked as expected
          if (Math.abs(change - expected) < 0.01) {
            console.log(`  ✓ Update correct for ${initial.name}`);
          } else if (expected > 0) {
            console.log(`  ✗ Update incorrect for ${initial.name}!`);
          }
        }
      });
    }, 500);
  } catch (error) {
    console.error('Test 2 failed with error:', error);
  }
  
  // Test 3: Direct dispatch test
  try {
    console.log('\nTest 3: Direct dispatch test');
    
    // Pick a resource to test with
    const testResourceId = Object.keys(resources)[0];
    const testResource = resources[testResourceId];
    
    if (testResource) {
      const initialAmount = testResource.amount;
      const testAmount = 5.0;
      
      console.log(`Adding ${testAmount} directly to ${testResource.name}...`);
      
      // Dispatch directly to the store
      store.dispatch(addResourceAmount({
        id: testResourceId,
        amount: testAmount
      }));
      
      // Check result
      setTimeout(() => {
        const updatedState = store.getState();
        const updatedResource = updatedState.resources[testResourceId];
        
        if (updatedResource) {
          const newAmount = updatedResource.amount;
          const change = newAmount - initialAmount;
          
          console.log(`${testResource.name}: ${initialAmount.toFixed(2)} → ${newAmount.toFixed(2)} (change: ${change.toFixed(2)})`);
          
          if (Math.abs(change - testAmount) < 0.01) {
            console.log('✓ Direct dispatch test PASSED');
          } else {
            console.log('✗ Direct dispatch test FAILED!');
          }
        }
      }, 500);
    } else {
      console.warn('No resources available for Test 3');
    }
  } catch (error) {
    console.error('Test 3 failed with error:', error);
  }
  
  console.log('\nResource tests complete');
  console.groupEnd();
}

/**
 * Inject a button to run resource tests
 */
export function injectResourceTestButton() {
  // Create button
  const button = document.createElement('button');
  button.innerText = '🧪 Test Resources';
  button.style.position = 'fixed';
  button.style.bottom = '90px';
  button.style.right = '10px';
  button.style.zIndex = '9999';
  button.style.padding = '8px 16px';
  button.style.backgroundColor = '#64A79F';
  button.style.color = '#15131A';
  button.style.border = 'none';
  button.style.borderRadius = '4px';
  button.style.cursor = 'pointer';
  
  // Add click handler
  button.addEventListener('click', runResourceTests);
  
  // Add to document
  document.body.appendChild(button);
  
  console.log('Resource test button injected');
}